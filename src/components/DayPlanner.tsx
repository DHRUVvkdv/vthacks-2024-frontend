"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Mic, Ear, EarOff, AlertCircle } from "lucide-react";
import { giveGPTPromptToBackend } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function DayPlanner() {
  const { isAuthenticated, user, userAttributes, signIn, loading } = useAuth();
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [canSubmit, setCanSubmit] = useState<boolean>(true);
  const [generated, setGenerated] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  const speakPlan = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognition: any = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => prev + " " + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const animateText = (text: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === "bot") {
          return [...prev.slice(0, -1), { ...lastMessage, content: text.slice(0, i) }];
        } else {
          return [...prev, { role: "bot", content: text.slice(0, i) }];
        }
      });
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setCanSubmit(true);
        setGenerated(false);
      }
    }, 20);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setCanSubmit(false);
    setGenerated(true);
    setIsLoading(true);

    if (!generated) {
      setMessages([]);
    }

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    const currentQuery = query;
    setQuery("");

    try {
      if (userAttributes?.email) {
        const response = await giveGPTPromptToBackend(userAttributes.email, currentQuery);
        setIsLoading(false);
        if (response && response.detailed_summary) {
          animateText(response.detailed_summary);
        } else {
          animateText("Sorry, the response format was unexpected.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, an error occurred." }]);
      setCanSubmit(true);
      setGenerated(false);
    }
  };

  useEffect(() => {
    if (query.trim() !== "" && generated) {
      setGenerated(false);
      setCanSubmit(true);
    }
	console.log('Planner Page State:', { isAuthenticated, loading });
  }, [query, generated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-appAccentColor" />
              <h1 className="text-3xl font-bold">Access Restricted</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-xl">
              Sorry, you need to create an account or log in to use the Day Planner.
            </p>
            <p className="text-lg">
              It's important we know your accessibility needs to provide an accurate plan!
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="default"
              className="font-black"
              onClick={() => signIn()}
            >
              Log In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-black shadow-lg">
        <CardHeader>
          <CardTitle>Accessibility Trip Planner</CardTitle>
          <CardDescription>Plan your accessible trip with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="query">What kind of trip are you planning?</Label>
                <div className="relative">
                  <Textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., A day trip in Blacksburg"
                    className="resize-none mt-3"
                  />
                  <Button
                    type="button"
                    onClick={handleSpeechRecognition}
                    className="absolute right-2 bottom-2 p-2"
                    variant="ghost"
                  >
                    <Mic
                      className={`text-black dark:text-white ${
                        isListening ? "text-red-500" : "text-gray-500"
                      }`}
                    />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!canSubmit || query.trim() === "" || isLoading}
              >
                {isLoading ? "Loading..." : generated ? "Displaying Plan" : "Generate Plan"}
              </Button>
            </div>
          </form>

          {isLoading && (
            <p className="mt-4 text-center font-semibold text-appAccentColor">
              Loading your plan...
            </p>
          )}

          <div className="mt-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="p-2 rounded-lg">
                <p className="font-semibold mb-2">
                  {message.role === "user" ? "You:" : "Plan:"}
                </p>
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    className="prose dark:prose-invert max-w-none"
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-bold mt-2 mb-1" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-2" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 mb-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 mb-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-500 hover:underline" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            {messages.length > 0 && messages[messages.length - 1].role === "bot" && (
              <Button
                onClick={() => speakPlan(messages[messages.length - 1].content)}
                className="mt-4 font-black bg-black text-white"
              >
                <Ear />
              </Button>
            )}
            {messages.length > 0 && messages[messages.length - 1].role === "bot" && (
              <Button
                onClick={() => window.speechSynthesis.cancel()}
                className="mt-4 font-black bg-black text-white"
              >
                <EarOff />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}