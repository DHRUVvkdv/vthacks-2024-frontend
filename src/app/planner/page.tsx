'use client';

import { Suspense } from 'react';
import DayPlanner from "@/components/DayPlanner";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';
import { useRef } from 'react';
import { AlertCircle } from 'lucide-react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <CardContent className="p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    </div>
  );
}

function UnauthorizedState({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Access Required</CardTitle>
          <CardDescription className="text-center">
            Please log in to access the planner
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Button onClick={onLogin} size="lg">
            Log In to Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PlannerContent() {
  const { isAuthenticated, loading, signIn } = useAuth();
  const router = useRouter();
  const hasAttemptedRedirect = useRef(false);

  // Remove the redirect attempt since we want to show the UI message instead
  useEffect(() => {
    if (!loading && !isAuthenticated && !hasAttemptedRedirect.current) {
      hasAttemptedRedirect.current = true;
      // Don't redirect, let the UI handle it
    }
  }, [isAuthenticated, loading, router]);

  // If still loading, show loading state
  if (loading) {
    return <Loading />;
  }

  // If not authenticated, show unauthorized state
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-appAccentColor" />
              <h1 className="text-3xl font-bold">Access Required</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-xl">
              Please log in to use the Day Planner.
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

  // If authenticated, show planner
  return (
    <>
      <DayPlanner />
      <div className="shadow"></div>
    </>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PlannerContent />
    </Suspense>
  );
}