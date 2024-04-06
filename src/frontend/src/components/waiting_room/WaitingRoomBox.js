import React from "react";
import { useAuth } from "../../context/AuthContext";
import WaitingRoomInfo from "./WaitingRoomInfo";
import WaitingPlayersGrid from "./WaitingPlayerGrid";
import StartGameButton from "./StartGameButton";
import ExitRoomButton from "./ExitRoomButton";

const WaitingRoomBox = ({ gameData, roomData, playersData, myPlayerData }) => {
  const { game_id, is_tournament, game_point, time_limit, n_players } = gameData;
  const { id: room_id, title, host, join_players } = roomData;

  return (
    <div className="WaitingRoomBox d-flex-col full-height">
      <WaitingRoomInfo
        title={title}
        host={host}
        point={game_point}
        time={time_limit}
        nPlayers={n_players}
        joinPlayers={join_players}
      />
      <WaitingPlayersGrid players={playersData} host={host} isTournament={is_tournament || n_players === 4} />
      <div className="WaitingRoomButtons d-flex justify-content-end">
        {myPlayerData.host && <StartGameButton isActive={n_players === join_players} />}
        <ExitRoomButton />
      </div>
    </div>
  );
};

export default WaitingRoomBox;
