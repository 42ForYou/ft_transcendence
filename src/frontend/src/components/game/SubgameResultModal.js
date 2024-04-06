import React from "react";
import SubgameModal from "./SubgameModal";

const SubgameResultModal = ({ playerA, playerB, winner }) => {
  return (
    <div className="SubgameResultModal">
      <SubgameModal
        title={"대전 결과"}
        playerA={playerA}
        playerB={playerB}
        winner={winner}
        message={"잠시만 기다려주세요..."}
      />
    </div>
  );
};

export default SubgameResultModal;
