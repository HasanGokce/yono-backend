import styles from "./Code.module.scss";

interface CodeProps {
  children: string;
  className?: string;
}

export default function Code(props: CodeProps) {
  const { children, className } = props;

  return (
    <div className={`${className} ${styles.codeContainer} text-6xl`}>
      {children}
    </div>
  );
}
