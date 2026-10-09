"use client";

import { useEffect } from "react";

/** Catches crashes in the root layout itself (error.tsx can't, since it renders inside that layout). */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ display: "grid", minHeight: "100vh", placeItems: "center", textAlign: "center", fontFamily: "sans-serif" }}>
        <div>
          <p style={{ fontWeight: 600, letterSpacing: "0.02em" }}>VEXO</p>
          <h1 style={{ marginTop: 16, fontSize: 24, fontWeight: 500 }}>Something went wrong</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#6b7078" }}>
            We hit an unexpected error. Please try again shortly.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 24, borderRadius: 8, background: "#141414", color: "#fff", padding: "10px 20px", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
