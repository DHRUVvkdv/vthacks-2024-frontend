'use client';

import { Suspense } from 'react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

function PageContent() {
  console.log("Page content");
  // page content here
  return (
    // JSX here
    <div>Page Content</div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
}