import Image from "next/image";
import Button from "../atoms/Button";
import Title from "../atoms/Title";
import Link from "next/link";

interface GameInfo {
  id: number;
  attributes: {
    name: string;
    thumbnail: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export default function GameWelcomePage(props: { gameData: GameInfo }) {
  const name = props.gameData?.attributes.name;
  const thumbnailUrl = props.gameData?.attributes.thumbnail.data.attributes.url;
  const gameId = props.gameData?.id;
  const imageUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL + thumbnailUrl;
  return (
    <div className="relative flex min-h-screen justify-center overflow-hidden mt-4 pl-2 pr-2">
      <div>
        <div>
          <Title>{name}</Title>
          <Image
            src={imageUrl}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt="Game thumbnail"
          />
          <Link href={`/games/${gameId}/nickname`}>
            <Button title={"Play with your friend"} />
          </Link>
          <div className="divide-y divide-gray-300/50">
            <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
