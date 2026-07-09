import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import "../globals.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const username = session.user.name ?? "User";

  return (
    <div className="grid min-h-screen grid-cols-[250px_1fr]">
      <aside className="bg-muted overflow-auto p-4">side panel</aside>
      <div className="overflow-auto p-6">
        <h1 className="mb-4 text-2xl font-semibold">
          Welcome to your dashboard, {username}
        </h1>
        {children}
      </div>
    </div>
  );
}
