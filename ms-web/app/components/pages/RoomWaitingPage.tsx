import Avatar from "../atoms/Avatar";
import ButtonGame from "../molecules/ButtonGame";

interface RoomPageProps {
  gameState: {
    sharedPlayers: any;
    questionTitle: string;
    screenState: string;
  };
}

export default function RoomWaitingPage(props: RoomPageProps) {
  const { gameState } = props;
  const { sharedPlayers } = gameState;

  return (
    <div>
      <div className=" text-white py-4 px-8 fixed top-0 left-0 w-full z-50 mt-12">
        <div className="">
          {sharedPlayers &&
            sharedPlayers.map((player: any) => (
              <Avatar
                state={player.state}
                nickname={player.nickname}
                key={player.nickname}
              />
            ))}
        </div>
      </div>
      <div className=" text-white py-4 px-8 fixed inset-x-0 top-1/2 transform -translate-y-1/2 z-40">
        <p className="text-center text-4xl pt-4">
          Waiting game creator to start the game...
        </p>
      </div>
    </div>
  );
}
