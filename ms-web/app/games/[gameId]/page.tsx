import { fetchAPI } from "@/app/utils/fetch-api";
import GameWelcomeView from "@/app/components/views/GameWelcomeView";

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
  console.log(data);
  return <GameWelcomeView gameData={data} />;
}
