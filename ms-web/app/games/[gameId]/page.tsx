import { fetchAPI } from "@/app/utils/fetch-api";
import GameWelcomePage from "@/app/components/pages/GameWelcomePage";

interface Props {
  params: {
    gameId: string;
  };
}

async function fetchGameDetail(filter: string) {
  try {
    const path = `/games/${filter}`;
    const urlParamsObject = {
      sort: { createdAt: "desc" },
      populate: "thumbnail",
    };

    const responseData = await fetchAPI(path, urlParamsObject);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export default async function GameWelcome(props: Props) {
  const filter = props.params.gameId;
  const { data } = await fetchGameDetail(filter);

  if (!data) return null;
  return <GameWelcomePage gameData={data} />;
}
