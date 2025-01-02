"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DayPlanner from "@/components/DayPlanner";
import { useAuth } from '@/context/AuthContext';

const DayPlannerPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/home?redirect=/planner');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <DayPlanner />
      <div className="shadow"></div>
    </>
  );
};

export default DayPlannerPage;