import { useQRCode } from "next-qrcode";
import Title from "../atoms/Title";
import Code from "../atoms/Code";
import Info from "../atoms/Info";

interface GameWaitingProps {
  code: string;
}

export default function GameWaitingPage(props: GameWaitingProps) {
  const code = props.code;
  const { SVG } = useQRCode();

  console.log(`http://${process.env.NEXT_PUBLIC_URL}/join/${code}`);

  return (
    <div className="grid gap-2">
      {/* <Title align="center">gameName</Title> */}
      <p className="font-medium text-center">Davet kodu ile oyna:</p>
      <Code className="text-center">{code}</Code>
      <Info>Bu kodu arkadaşınızla paylaşın, oynamaya başlayın!</Info>
      <div className="flex justify-center items-center">
        <SVG
          text={`http://${process.env.NEXT_PUBLIC_URL}/join/${code}`}
          options={{
            margin: 2,
            width: 200,
            color: {
              dark: "#010599FF",
              light: "#FFBF60FF",
            },
          }}
        />
      </div>
    </div>
  );
}
