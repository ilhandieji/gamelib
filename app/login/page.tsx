import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import Link from 'next/dist/client/link';
import React from 'react'

const login = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center min-w-screen">
        <LoginForm />
        <div className="flex justify-center mt-2.5">
          <Button asChild variant="outline" size="lg" className="my-custom-btn">
            <Link href="/">Don't have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default login