'use client';

import { Suspense } from 'react';
import DayPlanner from "@/components/DayPlanner";
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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