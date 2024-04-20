import Button from "../atoms/Button";

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

  return (
    <div className="relative flex min-h-screen justify-center overflow-hidden mt-4 pl-2 pr-2">
      <div className="relative px-0 pt-0 pb-0 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="mx-auto max-w-md">
          <div className={className} role="alert">
            <strong className="font-bold">{text}</strong>
          </div>
          <span onClick={props.handleNextQuestion}>
            <Button title={"Next Question"}></Button>
          </span>
        </div>
      </div>
    </div>
  );
}
