"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6 text-destructive">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-foreground/50 max-w-md mb-8">
        We encountered an unexpected error. This has been logged and we're looking into it.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-xl font-medium hover:opacity-90 transition-all"
      >
        <RefreshCw size={18} />
        Try again
      </button>
    </div>
  );
}
