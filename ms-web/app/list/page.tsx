"use client";

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
          <img
            height={"200px"}
            width={"200px"}
            src={
              `https://yonoapp.com/cms` +
              gameData.data.attributes.thumbnail.data.attributes.url
            }
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
