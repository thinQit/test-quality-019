'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-secondary">Please try again.</p>
      <Button onClick={reset} aria-label="Retry">
        Retry
      </Button>
    </div>
  );
}

export default Error;
