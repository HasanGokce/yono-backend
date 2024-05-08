"use client";

import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { useRouter, useSearchParams } from "next/navigation";

export default function Join() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");
  const [gamePin, setGamePin] = useState(pin || "");
  const [nickName, setNickName] = useState("");

  useEffect(() => {
    if (socket.connected) {
      console.log("connected");
    }

    socket.on("gameStarted", (data) => {
      console.log("gameStarted", data);
    });

    socket.on("entranceInfo", (data) => {
      console.log("entranceInfo", data);
      const { gameToken, userToken, gamePin } = data;
      push(
        "/room?gameToken=" +
          gameToken +
          "&userToken=" +
          userToken +
          "&gamePin=" +
          gamePin
      );
    });
  }, []);

  // joinGame fonksiyonu
  const handleJoinGame = () => {
    if (gamePin.length === 6) {
      // 6 haneli kod kontrolü
      socket.emit("applyRoom", gamePin); // Sokete 'joinGame' olayı gönder
      console.log(`Trying to join game with PIN: ${gamePin}`);
      // push("/room?gameToken=g100&" + "userToken=u200");
    } else {
      console.log("Please enter a valid 6-digit game PIN.");
    }
  };

  return (
    <div className="grid items-center justify-center h-screen">
      <div className="w-full max-w-xs bg-slate-200 rounded-md">
        <form
          className="rounded p-4 mb-0"
          onSubmit={(e) => {
            e.preventDefault(); // Form gönderimini engelle
            handleJoinGame(); // joinGame fonksiyonunu çağır
          }}
        >
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 font-extrabold focus:outline-none focus:shadow-outline text-center leading-8"
              id="gamePin"
              type="text"
              placeholder="Game PIN"
              autoFocus={false}
              value={gamePin}
              onChange={(e) => setGamePin(e.target.value)} // Oyun PIN kodunu güncelle
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 font-extrabold focus:outline-none focus:shadow-outline text-center leading-8"
              id="gamePin"
              type="text"
              placeholder="Nickname"
              autoFocus={true}
              value={nickName}
              onChange={(e) => setNickName(e.target.value)} // Oyun PIN kodunu güncelle
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline leading-8"
              type="submit"
              disabled={gamePin.length !== 6}
            >
              Enter
            </button>
          </div>
        </form>
      </div>
      <div>
        {" "}
        <p className="text-center text-gray-500 text-xs">
          &copy;2024 Yono Apps. All rights reserved.
        </p>
      </div>
    </div>
  );
}
