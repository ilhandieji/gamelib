import { GameSearchPanel } from "@/components/GameSearchPanel";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Game library</h1>
        <p className="text-sm text-muted-foreground">
          Search and filter games with combined criteria across metadata and scores.
        </p>
      </div>

      <GameSearchPanel />
    </div>
  );
}
