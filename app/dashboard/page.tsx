import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const username = session.user.name ?? "User";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Welcome to your dashboard, {username}</h1>
      <p className="mt-2 text-muted-foreground">
        You are signed in and should not need to log in again on refresh.
      </p>
    </div>
  );
}
