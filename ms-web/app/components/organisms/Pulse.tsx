interface PulseProps {
  color: "red" | "green";
  text: string;
}

export function Pulse(props: PulseProps) {
  const classValue = props.color === "green" ? "pulse-green" : "pulse-red";

  const text =
    props.color === "green"
      ? "Both players gave the same answer!"
      : "Different answers!";

  return (
    <div className={classValue}>
      <p className="text-center">{text}</p>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
