import { Button } from "@/components/atoms/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-5xl font-medium tracking-tight">NOT FOUND</h1>
        <p className="mt-3 mb-6 text-muted">This page ran off to the gym.</p>
        <Button href="/">BACK HOME</Button>
      </div>
    </main>
  );
}
