import React from "react";
import Avatar from "../common/Avatar";

const WinOrLose = ({ isWinner }) => {
  return (
    <div className="win-or-lose">
      {isWinner ? <p className="mb-2 winner-text">WINNER!</p> : <p className="mb-2 loser-text">LOSER...</p>}
    </div>
  );
};

const PlayerInModal = ({ nickname, avatar, isMine, isWinner = undefined }) => {
  return (
    <div className="d-flex-col player-in-modal text-center align-items-center justify-content-center">
      {isWinner !== undefined && <WinOrLose isWinner={isWinner} />}
      <Avatar src={avatar} diameter={130} />
      <p className="pt-2 mb-0" style={isMine ? { color: "rgb(25 209 186)", fontWeight: "bold" } : null}>
        {nickname}
      </p>
    </div>
  );
};

export default PlayerInModal;
