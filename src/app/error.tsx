"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-frame p-2.5 text-center">
      <div>
        <p className="text-sm font-semibold tracking-[0.02em]">VEXO</p>
        <h1 className="mt-4 text-2xl font-medium">Something went wrong</h1>
        <p className="mt-2 text-sm text-[#6b7078]">
          We hit an unexpected error loading this page. Give it another try, or head back home.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[#141414] px-5 py-2.5 text-[14px] font-medium text-white"
          >
            Try again
          </button>
          <Link href="/" className="rounded-lg border border-[#d8dade] px-5 py-2.5 text-[14px] font-medium">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
