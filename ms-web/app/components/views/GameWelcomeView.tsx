import Image from "next/image";
import Button from "../atoms/Button";

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

export default function GameWelcomeView(props: { gameData: GameInfo }) {
  const name = props.gameData.attributes.name;
  const thumbnailUrl = props.gameData.attributes.thumbnail.data.attributes.url;

  const imageUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL + thumbnailUrl;
  return (
    <div>
      <div className="relative flex min-h-screen justify-center overflow-hidden mt-4 pl-2 pr-2">
        <div className="relative px-0 pt-0 pb-0 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
          <div className="mx-auto max-w-md">
            <h1 className="text-neutral-100 mb-4 text-2xl font-extrabold leading-none tracking-tight">
              {name}
            </h1>
            <img
              src={imageUrl}
              // className="shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]"
            />
            <Button title={"Hemen Oyna"} />
            <Button title={"Arkadaşını Davet Et"} />
            <div className="divide-y divide-gray-300/50">
              <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
                <p>
                  An advanced online playground for Tailwind CSS, including
                  support for things like:
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
