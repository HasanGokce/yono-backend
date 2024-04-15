"use client";

import { useEffect } from "react";
import RoomPage from "../components/pages/RoomPage";
import { socket } from "../utils/socket";

interface Props {
  searchParams: {
    roomId: string;
    gameToken: string;
    userToken: string;
  };
}

export default function RoomPageContainer(props: Props) {
  const { gameToken, userToken, roomId } = props.searchParams;

  useEffect(() => {
    if (socket.connected) {
      console.log("connected for room");
    }

    socket.emit("joinRoom", { roomId, gameToken, userToken });

    return () => {
      socket.emit("leaveRoom", { roomId, gameToken, userToken });
    };
  }, [gameToken, userToken, roomId]);

  if (!gameToken || !userToken) {
    return null;
  }

  return <RoomPage gameToken={gameToken} userToken={userToken} />;
}
