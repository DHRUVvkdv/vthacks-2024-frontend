// components/AmplifyConfigurer.tsx
'use client';

import { useEffect } from 'react';
import { configureAmplify } from '@/lib/auth-config';

export function AmplifyConfigurer() {
  useEffect(() => {
    configureAmplify();
  }, []);

  return null;
}