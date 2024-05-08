interface WaitingPlayersProps {
  players: { nickName: string; level: number }[] | undefined;
}

export default function WaitingPlayers(props: WaitingPlayersProps) {
  let players = props.players || [];

  console.log(players);

  return (
    <div className="table-auto text-left bg-slate-800 p-4 rounded-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Waiting for players...</h1>
        <p className="text-lg mt-4">
          Please wait for other players to join the game.
        </p>
      </div>
      <div>
        <div className="flex mt-2">
          <div className="flex-[2_2_0%]">Nickname</div>
          <div>Level</div>
        </div>
        {players.map((player) => (
          <div key={player.nickName} className="flex mt-2">
            <div className="flex-[2_2_0%] font-black">{player.nickName}</div>
            <div>0</div>
          </div>
        ))}
      </div>
    </div>
  );
}
