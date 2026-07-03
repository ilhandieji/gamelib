import { SignUpForm } from "@/components/SignUpForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";
import * as React from "react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center min-w-screen">
        <SignUpForm />
        <div className="flex justify-center mt-2.5">
          <Button asChild variant="link" size="sm">
            <Link href="/login">
              Have an account? login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
