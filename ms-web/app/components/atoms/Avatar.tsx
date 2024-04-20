interface Props {
  src?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
  className?: string;
  state: string;
}

export default function Avatar(props: Props) {
  let { src, size, alt, className, state } = props;
  if (!src) {
    src = "https://www.w3schools.com/howto/img_avatar.png";
  }

  let color = "";
  if (state === "answered") {
    color = "bg-green-500";
  } else {
    color = "bg-yellow-500";
  }

  return (
    <div className="relative">
      <img className="w-10 h-10 rounded-full mr-2" src={src} alt="" />
      <span
        className={`top-0 left-7 absolute  w-3.5 h-3.5 rounded-full ${color}`}
      ></span>
    </div>
  );
}
