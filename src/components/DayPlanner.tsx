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
import { useUser, useRedirectFunctions } from "@propelauth/nextjs/client";
import { Mic, Ear, EarOff, AlertCircle } from "lucide-react";

interface Message {
	role: "user" | "bot";
	content: string;
}

const sendMessageToServer = async (message: string) => {
	// Simulate API call
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return `Here's your accessible plan for the day based on your request: "${message}"
1. Start with a visit to the fully wheelchair-accessible Art Museum at 10 AM.
2. Enjoy lunch at the nearby Inclusive Cafe, which offers menus in Braille and large print.
3. In the afternoon, attend an ASL-interpreted tour of the Botanical Gardens.
4. End your day with a relaxing session at the Sensory-Friendly Park.`;
};

export default function AccessibilityTripPlanner() {
	const { user } = useUser();
	const { redirectToLoginPage, redirectToSignupPage } = useRedirectFunctions();
	const [query, setQuery] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [canSubmit, setCanSubmit] = useState<boolean>(true);
	const [generated, setGenerated] = useState<boolean>(false);
	const [isListening, setIsListening] = useState<boolean>(false);

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
				setGenerated(false); // Reset generated state when animation is complete
			}
		}, 20);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!canSubmit) return; // Prevent submission if already processing

		setCanSubmit(false);
		setGenerated(true);

		// Clear previous messages if this is a new generation
		if (!generated) {
			setMessages([]);
		}

		setMessages((prev) => [...prev, { role: "user", content: query }]);
		const currentQuery = query; // Store current query
		setQuery(""); // Clear input field

		try {
			const response = await sendMessageToServer(currentQuery);
			animateText(response);
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) => [...prev, { role: "bot", content: "Sorry, an error occurred." }]);
			setCanSubmit(true);
			setGenerated(false);
		}
	};

	// Reset state when user starts typing a new query
	useEffect(() => {
		if (query.trim() !== "" && generated) {
			setGenerated(false);
			setCanSubmit(true);
		}
	}, [query, generated]);

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen  p-4">
				<Card className="max-w-2xl w-full">
					<CardHeader>
						<CardTitle className="text-center">
							<AlertCircle className="w-16 h-16 mx-auto mb-4 text-appAccentColor" />
							<h1 className="text-3xl font-bold ">Access Restricted</h1>
						</CardTitle>
					</CardHeader>
					<CardContent className="text-center space-y-4">
						<p className="text-xl ">
							Sorry, you need to create an account or log in to use the Day Planner.
						</p>
						<p className="text-lg ">
							It&rsquo;s important we know your accessibility needs to provide an
							accurate plan!
						</p>
					</CardContent>
					<CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
						<Button
							size="lg"
							variant="default"
							className="font-black"
							onClick={() => redirectToSignupPage()}
						>
							Create Account
						</Button>
						<Button size="lg" variant="outline" onClick={() => redirectToLoginPage()}>
							Log In
						</Button>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="md:min-h-screen p-6 md:p-12 relative">
			<Card className="w-full max-w-2xl mx-auto bg-white dark:bg-black shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
											className={` text-black dark:text-white ${
												isListening ? "text-red-500" : "text-gray-500"
											}`}
										/>
									</Button>
								</div>
							</div>
							<Button type="submit" disabled={!canSubmit || query.trim() === ""}>
								{generated ? "Displaying Plan" : "Generate Plan"}
							</Button>
						</div>
					</form>
					<div className="mt-6 space-y-4">
						{messages.map((message, index) => (
							<div key={index}>
								<p className="font-semibold">
									{message.role === "user" ? "You:" : "Plan:"}
								</p>
								<p>{message.content}</p>
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
