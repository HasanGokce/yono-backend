"use client";

import { useEffect, useState } from "react";

import { socket } from "@/app/utils/socket";
import LobbyPage from "@/app/components/pages/LobbyPage";
import Wifi from "@/app/components/atoms/Wifi";
import Button from "@/app/components/atoms/Button";
import Link from "next/link";

interface Props {
  params: {
    gameId: string;
  };
  searchParams: {
    nickname: string;
  };
}

interface GameData {
  gameToken: string;
  gamePin: string;
  userToken: string;
}

export default function WaitingPage(props: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [_, setTransport] = useState("N/A");
  const [gameData, setGameData] = useState<GameData>({
    gameToken: "",
    gamePin: "",
    userToken: "",
  });
  const [sharedPlayers, setSharedPlayers] = useState([
    { nickname: props.searchParams.nickname, level: 0 },
  ] as any[]);

  console.log(props);

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

      socket.on("gameState", (data) => {
        console.log("gameState", data);
        setSharedPlayers(data.sharedPlayers);
      });

      socket.emit("createGame", {
        gameId: props.params.gameId,
        nickname: props.searchParams.nickname,
      });
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

  const gameLink = `/room?gameToken=${gameData.gameToken}&userToken=${gameData.userToken}&gamePin=${gameData.gamePin}`;

  const wifi = isConnected ? (
    <Wifi status="connected" />
  ) : (
    <Wifi status="disconnected" />
  );

  const isDisabled = sharedPlayers.length <= 1 ? true : false;

  return (
    <div>
      {/* {wifi} */}
      {/* <p>Transport: {transport}</p> */}
      <LobbyPage
        code={gameData.gamePin}
        nickname={props.searchParams.nickname}
        players={sharedPlayers || []}
      />

      <Link href={gameLink}>
        <Button title="Start game" disabled={isDisabled}></Button>
      </Link>
    </div>
  );
}
