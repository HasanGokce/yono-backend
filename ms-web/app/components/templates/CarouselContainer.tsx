import { ScrollingCarousel } from "@trendyol-js/react-carousel";
import Image from "next/image";

import CarouselItem from "../organisms/CarouselItem";
import { getStrapiMedia } from "../../utils/api-helpers";

interface Props {
  title: string;
  size?: "small" | "medium" | "large";
  icon?: string;
  games?: any;
}

export default function CarouselContainer({ title, size, icon, games }: Props) {
  const iconPath = `/icons/home-${icon}.svg`;

  return (
    <div className="carousel-container">
      <div className="flex ml-4">
        <Image
          src={iconPath}
          alt="Vercel Logo"
          className="dark:invert"
          width={24}
          height={24}
          priority={true}
        />
        <h1 className="mb-4 text-2xl pt-4 ml-4 font-extrabold leading-none tracking-tight">
          {title}
        </h1>
      </div>

      <ScrollingCarousel>
        {games &&
          games.map((game: any) => (
            <CarouselItem
              key={game.id}
              id={game.id}
              title={game.attributes.name}
              size={size}
              thumbnail={
                process.env.NEXT_PUBLIC_STRAPI_API_URL +
                game.attributes?.thumbnail?.data?.attributes?.url
              }
            />
          ))}
      </ScrollingCarousel>
    </div>
  );
}
