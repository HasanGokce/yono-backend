import Avatar from "../atoms/Avatar";
import ButtonGame from "../molecules/ButtonGame";

interface RoomPageProps {
  gameState: {
    sharedPlayers: any;
    questionTitle: string;
    screenState: string;
  };
  handleAnswer: (answer: boolean) => void;
}

export default function RoomPage(props: RoomPageProps) {
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
                nickName={player.nickName}
                key={player.nickName}
              />
            ))}
        </div>
      </div>
      <div className=" text-white py-4 px-8 fixed inset-x-0 top-1/2 transform -translate-y-1/2 z-40">
        <p className="text-center text-4xl pt-4">{gameState?.questionTitle}</p>
      </div>

      <div className=" text-white py-4 px-8 fixed bottom-0 left-0 w-full z-30">
        <ButtonGame handleAnswer={props.handleAnswer} />
      </div>
    </div>
  );
}
