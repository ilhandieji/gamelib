import { LoginForm } from '@/components/LoginForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import Link from 'next/dist/client/link';
import React from 'react'

const login = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center min-w-screen">
        <LoginForm />
        <div className="flex justify-center mt-2.5">
          <Button asChild variant="link" size="sm">
            <Link href="/">Don't have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default login