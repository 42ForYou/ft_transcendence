import React from "react";
import SubgameModal from "./SubgameModal";

const SubgameBracketModal = ({ playerA, playerB, remainingTime }) => {
  return (
    <div className="SubgameBracketModal">
      <SubgameModal
        title={"다음 대전"}
        playerA={playerA}
        playerB={playerB}
        message={remainingTime > 0 ? `게임 시작까지 ${remainingTime}초 남았습니다...` : "게임 시작 준비 중..."}
      />
    </div>
  );
};

export default SubgameBracketModal;
