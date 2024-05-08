interface LayoutStartProps {
  children: React.ReactNode;
}

export default function LayoutStart({ children }: LayoutStartProps) {
  return (
    <div className="relative flex min-h-screen justify-center overflow-hidden mt-4 pl-2 pr-2">
      <div className="relative px-0 pt-0 pb-0 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="mx-auto max-w-md">{children}</div>
      </div>
    </div>
  );
}
