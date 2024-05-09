import Link from "next/link";
import Image from "next/image";
import { YONO_ROUTES } from "../../utils/constant";

interface Props {
  id: string;
  title: string;
  size?: "small" | "medium" | "large";
  thumbnail: string;
}

export default function CarouselItem({
  id,
  title,
  size = "medium",
  thumbnail,
}: Props) {
  let imageSize = "w-64"; // Default size
  if (size === "small") {
    imageSize = "w-40";
  } else if (size === "large") {
    imageSize = "w-96";
  }
  return (
    <Link href={`${YONO_ROUTES.GAMES}/${id}`}>
      <div className={`carousel-item ${imageSize}`}>
        <Image
          src={thumbnail}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          alt="Game thumbnail"
        />
        <h2 className="text-slate-100 mb-4 text-sm pt-2 font-bold leading-none tracking-tight">
          {title}
        </h2>
      </div>
    </Link>
  );
}
