import React from "react";
import CustomModal from "../common/CustomModal";
import PlayerInModal from "./PlayerInModal";
import { useAuth } from "../../context/AuthContext";

const VStext = () => {
  return (
    <div
      className="vs-text"
      style={{
        fontSize: "3rem",
        fontWeight: "bold",
        fontFamily: "Noto Sans KR",
      }}>
      VS
    </div>
  );
};

const SubgameModal = ({ title, playerA, playerB, winner, message }) => {
  const { loggedInUser } = useAuth();

  if (!playerA || !playerB) {
    console.log("SubgameModal: playerA or playerB is null");
    return null;
  }

  return (
    <div className="SubgameModal">
      <CustomModal hasCloseButton={false} title={title}>
        <div className="content">
          <div className="d-flex align-items-center justify-content-between px-4">
            <PlayerInModal
              nickname={playerA.nickname}
              avatar={playerA.avatar}
              isMine={playerA.nickname === loggedInUser?.nickname}
              isWinner={winner ? winner === "A" : undefined}
            />
            {!winner && (
              <div className="d-flex align-items-center">
                <VStext />
              </div>
            )}
            <PlayerInModal
              nickname={playerB.nickname}
              avatar={playerB.avatar}
              isMine={playerB.nickname === loggedInUser?.nickname}
              isWinner={winner ? winner === "B" : undefined}
            />
          </div>
          <div className="text-end">
            <p className="pt-3 m-0">{message}</p>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default SubgameModal;
