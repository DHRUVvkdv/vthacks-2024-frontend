'use client';

import { Suspense } from 'react';
import DayPlanner from "@/components/DayPlanner";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';
import { useRef } from 'react';

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

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasAttemptedRedirect.current) {
      hasAttemptedRedirect.current = true;
      router.push('/home?redirect=/planner');
    }
  }, [isAuthenticated, loading, router]);

  // If still loading, show loading state
  if (loading) {
    return <Loading />;
  }

  // If not authenticated, show unauthorized state
  if (!isAuthenticated) {
    return <UnauthorizedState onLogin={signIn} />;
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