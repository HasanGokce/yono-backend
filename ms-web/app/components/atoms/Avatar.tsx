import Image from "next/image";

interface Props {
  src?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
  className?: string;
  state: string;
  nickname: string;
}

export default function Avatar(props: Props) {
  let { src, size, alt, className, state, nickname } = props;
  if (!src) {
    src = "https://cat-avatars.vercel.app/api/cat?name=" + nickname;
  }

  let color = "";
  if (state === "answered") {
    color = "bg-green-500";
  } else {
    color = "bg-yellow-500";
  }

  return (
    <div className="flex mt-2">
      <div className="relative">
        <Image
          src={src}
          width={30}
          height={30}
          alt={nickname}
          className="w-10 h-10 rounded-full mr-2"
        />
        <span
          className={`top-0 left-7 absolute  w-3.5 h-3.5 rounded-full ${color}`}
        ></span>
      </div>
      <div>{nickname}</div>
    </div>
  );
}
