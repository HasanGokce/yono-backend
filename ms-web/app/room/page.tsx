"use client";

import { useEffect, useState } from "react";
import RoomPage from "../components/pages/RoomPage";
import { socket } from "../utils/socket";
import QuestionResultPage from "../components/pages/QuestionResultPage";
import WaitingPage from "../games/[gameId]/lobby/page";
import RoomWaitingPage from "../components/pages/RoomWaitingPage";

interface Props {
  searchParams: {
    gamePin: string;
    gameToken: string;
    userToken: string;
  };
}

export default function RoomPageContainer(props: Props) {
  const { gameToken, userToken, gamePin } = props.searchParams;
  const [gameState, setGameState] = useState({} as any);

  const handleAnswer = (answer: boolean) => {
    socket.emit("questionAnswered", { gamePin, gameToken, userToken, answer });
    console.log("@questionAnswered");
  };

  useEffect(() => {
    if (socket.connected) {
      console.log("connected for room");
    }

    socket.emit("joinRoom", { gamePin, gameToken, userToken });

    socket.on("gameState", (gameState): void => {
      setGameState(gameState);
      console.log("@gameState", gameState);
    });

    socket.on("joinedChannel", (gameState): void => {
      console.log("@joinedChannel", gameState);
    });

    return () => {
      socket.emit("leaveRoom", { gamePin, gameToken, userToken });
    };
  }, []);

  const handleNextQuestion = () => {
    socket.emit("nextQuestion", { gamePin, gameToken, userToken });
  };

  if (gameState.screenState === "QUESTION") {
    return <RoomPage gameState={gameState} handleAnswer={handleAnswer} />;
  }

  if (gameState.screenState === "MATCHED") {
    return (
      <QuestionResultPage
        result={"matched"}
        handleNextQuestion={handleNextQuestion}
        users={gameState.sharedPlayers}
      />
    );
  }

  if (gameState.screenState === "UNMATCHED") {
    return (
      <QuestionResultPage
        result={"unmatched"}
        handleNextQuestion={handleNextQuestion}
        users={gameState.sharedPlayers}
      />
    );
  }

  if (gameState.screenState === "WAITING") {
    return <RoomWaitingPage gameState={gameState} />;
  }

  if (gameState.screenState === "FINISHED") {
    return (
      <div>
        <div className="grid align-middle items-center text-center pt-20 pb-20">
          <div className="text-7xl text font-black">{gameState.matchRatio}</div>
          <div className="text-3xl text font-black text-yellow-600">MATCH</div>
        </div>

        {/* <Button title="Add Friend..." style="primary"></Button>
        <Button title="Send message..." style="secondary"></Button> */}
      </div>
    );
  }

  return <div>Loading...</div>;
}
