// import { useQRCode } from "next-qrcode";
// import Title from "../atoms/Title";
import WaitingPlayers from "../organisms/WaitingPlayers";
// import Code from "../atoms/Code";
// import Info from "../atoms/Info";

interface GameWaitingProps {
  code: string;
  nickname: string;
  players: { nickname: string; level: number }[] | undefined;
}

export default function LobbyPage(props: GameWaitingProps) {
  const code = props.code;
  // const { SVG } = useQRCode();
  const joinUrl = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_BASE_PATH}/join?pin=${code}`;

  const players = props.players || [{ nickname: props.nickname, level: 1 }];

  return (
    <div className="grid gap-2">
      <WaitingPlayers players={players} />
      <div className="p-4 mt-4 bg-slate-800 rounded-md">
        <p className="text-center">
          Share this joining info with other person that you want to play
        </p>

        <div className="flex p-2 mt-2 bg-slate-700 rounded-md">
          {joinUrl}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
            />
          </svg>
        </div>
      </div>

      {/* <div className="flex justify-center items-center">
        <SVG
          text={joinUrl}
          options={{
            margin: 2,
            width: 200,
            color: {
              dark: "#010599FF",
              light: "#FFBF60FF",
            },
          }}
        />
      </div> */}
    </div>
  );
}
