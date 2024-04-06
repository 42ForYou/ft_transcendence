import React from "react";
import Bracket from "../../components/game/Bracket";
import { useGame } from "../../context/GameContext";
import LoadingPage from "../LoadingPage";

const player = (intra_id, nickname, avatar) => {
  return {
    intra_id: intra_id,
    nickname: nickname,
    avatar: avatar,
  };
};

const BracketPage = () => {
  const { bracketData } = useGame();

  if (!bracketData) return <LoadingPage />;

  return (
    <div className="BracketPage">
      <div className="d-flex-col justify-content-between p-5 flex-grow-1">
        <h1 className="text-start border-bottom pb-3 m-0">Bracket</h1>
        <Bracket nRanks={bracketData.n_ranks} subgames={bracketData.subgames} />
      </div>
    </div>
  );
};

export default BracketPage;
