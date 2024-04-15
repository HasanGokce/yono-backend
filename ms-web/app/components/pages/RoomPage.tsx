import ButtonGame from "../molecules/ButtonGame";

interface RoomPageProps {
  gameToken: string;
  userToken: string;
}

export default function RoomPage(props: RoomPageProps) {
  const { gameToken, userToken } = props;
  return (
    <div>
      <div className=" text-white py-4 px-8 fixed top-0 left-0 w-full z-50 mt-12">
        <h1>Room state: waitingPlayers</h1>
        <p>{gameToken}</p>
        <p>{userToken}</p>
        <p></p>
      </div>

      <div className=" text-white py-4 px-8 fixed inset-x-0 top-1/2 transform -translate-y-1/2 z-40">
        <p className="text-center text-4xl pt-4">
          Have you ever sung in the shower and thought you sounded like a
          rockstar?
        </p>
      </div>

      <div className=" text-white py-4 px-8 fixed bottom-0 left-0 w-full z-30">
        <ButtonGame />
      </div>
    </div>
  );
}
