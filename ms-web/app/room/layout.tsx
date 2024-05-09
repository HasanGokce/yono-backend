interface LayoutStartProps {
  children: React.ReactNode;
}

export default function LayoutStart({ children }: LayoutStartProps) {
  return <div className="mx-auto max-w-md">{children}</div>;
}
