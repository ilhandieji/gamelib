export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      <div className="bg-muted overflow-auto">side panel</div>
      <div className="overflow-auto">
      {children}
        <h1>Welcome back </h1>
        {children}
        </div>
    </div>
  );
}
