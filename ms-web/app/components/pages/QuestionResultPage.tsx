import Button from "../atoms/Button";
import { Pulse } from "../organisms/Pulse";

interface QuestionResultProps {
  result: string;
  handleNextQuestion?: () => void;
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
    <div className="flex flex-col space-y-4 text-white py-4 px-8 fixed top-0 left-0 w-full z-50 mt-12 border-2 h-full">
      <div className="mx-auto max-w-md border-2">
        <Pulse color={pulseColor} text={text}></Pulse>
      </div>
      <div className=" text-white py-4 px-8 z-30">
        <span onClick={props.handleNextQuestion}>
          <Button title={"Next"}></Button>
        </span>
      </div>
    </div>
  );
}
