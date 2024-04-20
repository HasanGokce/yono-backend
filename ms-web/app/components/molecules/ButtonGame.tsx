import React, { useState } from "react";

export default function ButtonGame(props: {
  handleAnswer: (socket: any) => void;
}) {
  // Her bir düğme için ayrı durumlar
  const [yesClicked, setYesClicked] = useState(false);
  const [noClicked, setNoClicked] = useState(false);

  // "Yes" düğmesine tıklandığında durumu değiştiren fonksiyon
  const handleYesClick = () => {
    if (yesClicked || noClicked) {
      return;
    }
    setYesClicked(true);
    props.handleAnswer(true);
    console.log("Yes Button clicked");
  };

  // "No" düğmesine tıklandığında durumu değiştiren fonksiyon
  const handleNoClick = () => {
    if (noClicked || yesClicked) {
      return;
    }
    setNoClicked(true);
    props.handleAnswer(false);
    console.log("No Button clicked");
  };

  return (
    <div>
      <button
        onClick={handleYesClick}
        className={`text-xl font-extrabold w-full h-12 px-6 text-gray-600 transition-colors duration-150 ${
          yesClicked ? "yono-bg-color" : "bg-gray-900 hover:bg-gray-400"
        } rounded-lg focus:shadow-outline mb-2 mt-2 border border-slate-800`}
      >
        <span>Yes</span>
      </button>
      <button
        onClick={handleNoClick}
        className={`text-xl font-extrabold w-full h-12 px-6 text-gray-600 transition-colors duration-150 ${
          noClicked ? "yono-bg-color" : "bg-gray-900 hover:bg-gray-400"
        }  rounded-lg focus:shadow-outline mb-2 mt-2 border border-slate-800`}
      >
        <span>No</span>
      </button>
    </div>
  );
}
