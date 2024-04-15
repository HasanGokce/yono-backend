interface TitleProps {
  children: string;
  align?: "center" | "left" | "right";
}

export default function Title(props: TitleProps) {
  const title = props.children;
  const alignClass = props.align ? `text-${props.align}` : "";

  return (
    <h1
      className={`text-neutral-100 mb-4 text-2xl font-extrabold leading-none tracking-tight ${alignClass}`}
    >
      {title}
    </h1>
  );
}
