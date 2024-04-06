import React, { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";
import BracketPage from "./BracketPage";
import PongScenePage from "./PongScenePage";
import { useNavigate } from "../../lib/rrfs/index.js";
import TournamentResultModal from "../../components/game/TournamentResultModal";
import SubgameBracketModal from "../../components/game/SubgameBracketModal";
import SubgameResultModal from "../../components/game/SubgameResultModal";

const GamePlayPage = () => {
  const navigate = useNavigate();
  const {
    roomNamespace,
    bracketData,
    subgameStatus,
    connectNextSubgameSocket,
    getMyFinalSubgameAndRank,
    disconnectRoomSocket,
  } = useGame();
  const [currentPage, setCurrentPage] = useState(true); // "bracket" or "pongScene"
  const [currentModal, setCurrentModal] = useState(null);
  const [rankOngoing, setRankOngoing] = useState(null);

  useEffect(() => {
    if (!roomNamespace) {
      alert("입장이 불가한 게임입니다.");
      navigate("/game/list");
    }
  }, []);

  // 갱신된 대진표 정보에 따라 모달 변경
  useEffect(() => {
    if (!bracketData || rankOngoing === bracketData.rank_ongoing) return; // 현재 진행중인 "강"이 같으면 무시
    const newRankOngoing = bracketData.rank_ongoing;
    const myFinalSubgameAndRank = getMyFinalSubgameAndRank(bracketData.subgames);

    setCurrentPage("bracket");
    if (newRankOngoing < 0) {
      // 모든 "강"이 끝남
      setCurrentModal("tournamentResult");
    } else if (myFinalSubgameAndRank.rank !== newRankOngoing) {
      // 패배하여 다음 "강"으로 넘어가지 못함
      setCurrentModal("tournamentResult");
      disconnectRoomSocket();
    } else {
      // 승리하여 다음 "강"으로 넘어감
      setCurrentModal(null);
      connectNextSubgameSocket(bracketData);
      setRankOngoing(newRankOngoing);
    }
  }, [bracketData]);

  // 서브게임 진행 상태에 따라 모달, 페이지 변경
  useEffect(() => {
    // console.log("subgameStatus", subgameStatus);
    if (subgameStatus.progress === "waiting") {
      setCurrentPage("pongScene");
      setCurrentModal("subgameBracket");
    } else if (subgameStatus.progress === "playing") {
      setCurrentModal(null);
    } else if (subgameStatus.progress === "ended") {
      setCurrentModal("subgameResult");
    } else if (subgameStatus.progress === "none") {
      setCurrentPage("bracket");
    }
  }, [subgameStatus.progress]);

  return (
    <div className="GamePlayPage">
      {currentPage === "bracket" ? <BracketPage /> : <PongScenePage />}
      {currentModal === "tournamentResult" && <TournamentResultModal bracketData={bracketData} />}
      {currentModal === "subgameResult" && (
        <SubgameResultModal
          playerA={subgameStatus.player_a}
          playerB={subgameStatus.player_b}
          winner={subgameStatus.winner}
        />
      )}
      {currentModal === "subgameBracket" && (
        <SubgameBracketModal
          playerA={subgameStatus.player_a}
          playerB={subgameStatus.player_b}
          remainingTime={subgameStatus.time_before_start}
        />
      )}
    </div>
  );
};

export default GamePlayPage;
