import Button from "../atoms/Button";
import AvatarList from "../molecules/AvatarList";
import AvatarResultList from "../molecules/AvatarResultList";
import { Pulse } from "../organisms/Pulse";

interface QuestionResultProps {
  result: string;
  handleNextQuestion?: () => void;
  users: {
    avatar: string;
    name: string;
    state: string;
    nickname: string;
  }[];
}

export default function QuestionResultPage(props: QuestionResultProps) {
  let text = "";
  let className = "";

  if (props.result === "matched") {
    text = "You have given the same answers";
    className =
      "bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded relative";
  } else {
    text = "You have given different answers";
    className =
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4rounded relative";
  }

  const pulseColor = props.result === "matched" ? "green" : "red";

  return (
    <div>
      <div className="grid text-white w-full z-50 ">
        <div className="mx-auto max-w-md">
          <Pulse color={pulseColor} text={text}></Pulse>
        </div>
        <AvatarResultList users={props.users} />
        <div className="text-white mt-2 mb-2 z-30">
          <span onClick={props.handleNextQuestion}>
            <Button title={"Next"}></Button>
          </span>
        </div>
      </div>
    </div>
  );
}
