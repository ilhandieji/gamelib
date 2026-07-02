import { SignUpForm } from "@/components/SignUpForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <SignUpForm />
    </main>
  );
}
