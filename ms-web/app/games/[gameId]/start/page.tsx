"use client";

import { useEffect, useState } from "react";

import { socket } from "@/app/utils/socket";
import GameWaitingPage from "@/app/components/pages/GameWaitingPage";
import Wifi from "@/app/components/atoms/Wifi";
import Button from "@/app/components/atoms/Button";

interface Props {
  params: {
    gamePin: string;
  };
}

interface GameData {
  gameToken: string;
  gamePin: string;
  userToken: string;
}

export default function WaitingPage(props: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [gameData, setGameData] = useState<GameData>({
    gameToken: "",
    gamePin: "",
    userToken: "",
  });

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      console.log("connection created");

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      socket.emit("createGame", { gameId: props.params.gamePin });
    }

    socket.on("gameCreated", (data) => {
      console.log("gameCreated", data);
      setGameData(data);
    });

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const invitationCode = "234215";

  const players = [
    {
      name: "Player 1",
      id: 1,
    },
    {
      name: "Player 2",
      id: 2,
    },
  ];

  const gameLink = `/room?gameToken=${gameData.gameToken}&userToken=${gameData.userToken}&gamePin=${gameData.gamePin}`;

  const wifi = isConnected ? (
    <Wifi status="connected" />
  ) : (
    <Wifi status="disconnected" />
  );

  return (
    <div>
      {wifi}
      {/* <p>Transport: {transport}</p> */}
      <GameWaitingPage code={gameData.gamePin} />

      <a href={gameLink}>
        <Button title="Start game"></Button>
      </a>
    </div>
  );
}
