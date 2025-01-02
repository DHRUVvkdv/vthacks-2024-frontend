'use client';

import { Suspense } from 'react';
import DayPlanner from "@/components/DayPlanner";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useState } from 'react';

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
  const [error, setError] = useState<Error | null>(null);

  console.log('Planner Page State:', { isAuthenticated, loading });  

  useEffect(() => {
    console.log('Auth Effect Running:', { isAuthenticated, loading }); 
    try {
      if (!loading && !isAuthenticated) {
        console.log('Redirecting to home - not authenticated');
        router.push('/home?redirect=/planner');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    }
  }, [isAuthenticated, loading, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card>
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-red-500 mb-4">{error.message}</p>
            <Button onClick={() => {
              setError(null);
              router.push('/home');
            }}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <UnauthorizedState onLogin={signIn} />;
  }

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