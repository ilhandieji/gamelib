import { Button } from "@/components/ui/button";
import { redirect } from "next/dist/client/components/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from "next/dist/client/link";
import { getServerSession } from "next-auth/next";
import { Gamepad2 } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center text-center">
      <h1 className="relative flex flex-col items-center justify-center">
        <Gamepad2 className="size-16" color="#3a5fb4" /> Welcome to the Game
        Library
      </h1>
      <div className="flex gap-2 justify-center mt-2.5">
        <Button className="w-28 h-10">
          <Link href="/login">Login</Link>
        </Button>
        <span className="flex felx col items-center justify-center text-lg">
          or
        </span>
        <Button className="w-28 h-10">
          <Link href="/signup">Signup</Link>
        </Button>
      </div>
    </div>
  );
}
