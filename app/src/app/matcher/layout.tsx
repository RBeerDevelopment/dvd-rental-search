export default function MatcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-col items-center bg-slate-50">
      {children}
    </div>
  );
}
