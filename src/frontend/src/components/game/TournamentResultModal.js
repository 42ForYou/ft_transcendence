import React from "react";
import BootstrapButton from "../common/BootstrapButton";
import CustomModal from "../common/CustomModal";
import { useNavigate } from "../../lib/rrfs/index.js";
import { useGame } from "../../context/GameContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";

const getWinnerOfSubgame = (subgame) => {
  if (subgame.winner === "A") return subgame.player_a;
  else return subgame.player_b;
};

const rankToString = (rank) => {
  if (rank === 0) return "결승전";
  else if (rank === 1) return "4강";
};

const TournamentWinnerContent = ({ finalSubgame }) => {
  const winner = getWinnerOfSubgame(finalSubgame);

  return (
    <>
      <h4 className="text-center">Congratulations!</h4>
      <div className="d-flex align-items-center justify-content-between">
        <img src={`${process.env.ASSETS_URL}/images/confetti-left.png`} alt="confetti-left" style={{ width: "33%" }} />
        <div className="d-flex-col text-center">
          <Avatar src={winner.avatar} diameter={130} />
          {/* <span className="winner-nickname">{winner.nickname}</span> */}
        </div>
        <img
          src={`${process.env.ASSETS_URL}/images/confetti-right.png`}
          alt="confetti-right"
          style={{ width: "33%" }}
        />
      </div>
      <h4 className="text-center">{winner.nickname}, You are the winner!</h4>
    </>
  );
};

const TournamentOthersContent = ({ finalSubgame, myFinalRank, isTournament }) => {
  const opponent = getWinnerOfSubgame(finalSubgame);

  return (
    <>
      <h4 className="text-center">Oops!</h4>
      <img src={`${process.env.ASSETS_URL}/images/black-hole.png`} alt="black-hole" style={{ width: "33%" }} />
      <h4 className="text-center">
        You&apos;ve been absorbed
        <br /> by the Black Hole...
      </h4>
      <p className="text-center mt-3 ">{opponent.nickname}에게 패배하여 블랙홀에 빨려 들어갔습니다.</p>
      {isTournament && <p className="text-end fst-italic">나의 최종 진출 라운드: {rankToString(myFinalRank)}</p>}
    </>
  );
};

const TournamentResultModal = ({ bracketData }) => {
  const { loggedInUser } = useAuth();
  const { getMyFinalSubgameAndRank } = useGame();
  const { subgame: myFinalSubgame, rank: myFinalRank } = getMyFinalSubgameAndRank(bracketData.subgames);
  const amIWinner = myFinalRank === 0 && getWinnerOfSubgame(myFinalSubgame).intra_id === loggedInUser.intra_id;
  const navigate = useNavigate();

  return (
    <div className="TournamentResultModal">
      <CustomModal
        hasCloseButton={false}
        title={"게임 결과"}
        footerButtons={<BootstrapButton label={"홈으로 이동"} styleType={"primary"} onClick={() => navigate("/")} />}>
        {amIWinner ? (
          <TournamentWinnerContent finalSubgame={myFinalSubgame} />
        ) : (
          <TournamentOthersContent
            finalSubgame={myFinalSubgame}
            myFinalRank={myFinalRank}
            isTournament={bracketData.is_tournament}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default TournamentResultModal;
