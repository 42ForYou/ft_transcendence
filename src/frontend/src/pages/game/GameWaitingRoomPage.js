import React, { useEffect } from "react";
import WaitingRoomBox from "../../components/waiting_room/WaitingRoomBox";
import { useParams, useNavigate } from "../../lib/rrfs/index.js";
import { useGame } from "../../context/GameContext";
import LoadingPage from "../LoadingPage";
import { get } from "../../utils/apiBase";
import { API_ENDPOINTS } from "../../utils/apiEndpoints";

const GameWaitingRoomPage = () => {
  const {
    roomNamespace,
    gameData,
    roomData,
    playersData,
    myPlayerData,
    connectRoomSocket,
    setupListenersRoomSocket,
    removeListenersRoomSocket,
  } = useGame();
  const navigate = useNavigate();
  const { room_id } = useParams();

  // 마운트시에 해당 방의 참가자인지 확인하고 room 소켓 연결 수립
  useEffect(() => {
    const checkIamInRoom = async (roomId) => {
      try {
        await get(API_ENDPOINTS.ROOM(roomId));
        return true;
      } catch (error) {
        if (error.response.status === 404) alert("해당 방이 존재하지 않습니다.");
        else if (error.response.status === 400) alert("해당 방의 참가자가 아닙니다.");
        console.error(error);
        navigate("/game/list");
        return false;
      }
    };

    (async () => {
      const isInRoom = await checkIamInRoom(room_id);
      if (isInRoom) {
        connectRoomSocket(room_id);
      }
    })();
  }, [room_id]);

  // room 소켓의 연결이 수립되면 리스너를 세팅
  useEffect(() => {
    if (!roomNamespace || !gameData) return;

    const navigateToPlayPage = () => {
      navigate(`/game/play/${gameData.game_id}`);
    };
    const events = [{ event: "update_tournament", handler: navigateToPlayPage }];
    setupListenersRoomSocket(events);

    return () => {
      removeListenersRoomSocket(events);
    };
  }, [roomNamespace, gameData]);

  if (!roomData) return <LoadingPage />;

  return (
    <div className="GameWaitingRoomPage">
      {gameData && roomData && playersData && (
        <WaitingRoomBox gameData={gameData} roomData={roomData} playersData={playersData} myPlayerData={myPlayerData} />
      )}
    </div>
  );
};

export default GameWaitingRoomPage;
