"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const IndexPage: React.FC = () => {
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(
          "https://yonoapp.com/cms/api/games/2?populate=thumbnail"
        );
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGameData();
  }, []);

  return (
    <div>
      {gameData ? (
        <div>
          <Image
            src={
              `https://yonoapp.com/cms` +
              gameData.data.attributes.thumbnail.data.attributes.url
            }
            height={200}
            width={200}
            alt={gameData.data.attributes.thumbnail.data.attributes.name}
          />
          <h2>{gameData.data.attributes.name}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default IndexPage;
