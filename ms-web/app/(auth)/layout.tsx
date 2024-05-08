export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 dark:bg-gray-900 ">
      <div className="w-96">{children}</div>
    </div>
  );
}
