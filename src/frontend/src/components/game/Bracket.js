import React from "react";
import Avatar from "../common/Avatar";
import { useAuth } from "../../context/AuthContext";

const getSubgameWinner = (subgame) => {
  if (!subgame["winner"]) return null;
  else if (subgame["winner"] === "A") return "player_a";
  else return "player_b";
};

const BracketPlayer = ({ player, columnCnt, nthColumn, topPos }) => {
  if (!player) return null;

  const { loggedInUser } = useAuth();
  const isMine = loggedInUser && player.intra_id === loggedInUser.intra_id;
  const { nickname, avatar } = player;
  const diameter = 130;
  const leftPos = (nthColumn / columnCnt) * 100;

  return (
    <div
      className="bracket-player p-0"
      style={{ position: "absolute", top: `${topPos}%`, left: `${leftPos}%`, zIndex: 100 }}>
      <div
        className={"text-center d-flex-col align-items-center"}
        style={{ width: `${diameter}px`, height: `${diameter}px`, transform: "translate(-50%, -50%)" }}>
        <Avatar src={avatar} diameter={130} />
        <div>
          <p style={{ color: `${isMine ? "#29ffe4" : ""}` }}> {nickname}</p>
        </div>
      </div>
    </div>
  );
};

const BracketBoxNonBorder = () => {
  return <div className="col bracket-box"></div>;
};

const BracketBoxLeftTopBorder = () => {
  return (
    <div
      className="col bracket-box"
      style={{
        borderLeft: "5px solid white",
        borderTop: "5px solid white",
      }}></div>
  );
};

const BracketBoxRightTopBorder = () => {
  return (
    <div
      className="col bracket-box"
      style={{
        borderRight: "5px solid white",
        borderTop: "5px solid white",
      }}></div>
  );
};

const BracketRow = ({ children }) => {
  return (
    <div className="row" style={{ position: "relative" }}>
      {children}
    </div>
  );
};

const BracketSubgame = ({ subgame }) => {};

// todo: 하드코딩 제거
const Bracket4Players = ({ subgames }) => {
  const winner00 = getSubgameWinner(subgames[0][0]);
  const winner10 = getSubgameWinner(subgames[1][0]);
  const winner11 = getSubgameWinner(subgames[1][1]);

  return (
    <>
      <div className="Bracket container-fluid p-0">
        <BracketRow>
          <BracketPlayer player={subgames[0][0][winner00]} columnCnt={2} nthColumn={1} topPos={85} />
          <BracketBoxNonBorder />
          <BracketBoxNonBorder />
        </BracketRow>

        <BracketRow>
          <BracketPlayer
            player={winner10 ? subgames[1][0][winner10] : subgames[0][0]["player_a"]}
            columnCnt={4}
            nthColumn={1}
            topPos={85}
          />
          <BracketPlayer
            player={winner11 ? subgames[1][1][winner11] : subgames[0][0]["player_b"]}
            columnCnt={4}
            nthColumn={3}
            topPos={85}
          />
          <BracketBoxNonBorder />
          <BracketBoxLeftTopBorder />
          <BracketBoxRightTopBorder />
          <BracketBoxNonBorder />
        </BracketRow>

        <BracketRow>
          <BracketBoxNonBorder />
          <BracketBoxLeftTopBorder />
          <BracketBoxRightTopBorder />
          <BracketBoxNonBorder />
          <BracketBoxNonBorder />
          <BracketBoxLeftTopBorder />
          <BracketBoxRightTopBorder />
          <BracketBoxNonBorder />
        </BracketRow>

        <BracketRow>
          <BracketPlayer player={subgames[1][0]["player_a"]} columnCnt={8} nthColumn={1} topPos={0} />
          <BracketPlayer player={subgames[1][0]["player_b"]} columnCnt={8} nthColumn={3} topPos={0} />
          <BracketPlayer player={subgames[1][1]["player_a"]} columnCnt={8} nthColumn={5} topPos={0} />
          <BracketPlayer player={subgames[1][1]["player_b"]} columnCnt={8} nthColumn={7} topPos={0} />
          <BracketBoxNonBorder />
          <BracketBoxNonBorder />
          <BracketBoxNonBorder />
          <BracketBoxNonBorder />
        </BracketRow>
      </div>
    </>
  );
};

// todo: subgames[0][0]["winner"] 값이 "A"라면 A의 정보를 가져와야함
const Bracket2Players = ({ subgames }) => {
  const winner00 = getSubgameWinner(subgames[0][0]);

  return (
    <div className="Bracket container-fluid p-0">
      <BracketRow>
        <BracketPlayer player={subgames[0][0][winner00]} columnCnt={2} nthColumn={1} topPos={85} />
        <BracketBoxNonBorder />
        <BracketBoxNonBorder />
      </BracketRow>

      <BracketRow>
        <BracketPlayer player={subgames[0][0]["player_a"]} columnCnt={4} nthColumn={1} topPos={85} />
        <BracketPlayer player={subgames[0][0]["player_b"]} columnCnt={4} nthColumn={3} topPos={85} />
        <BracketBoxNonBorder />
        <BracketBoxLeftTopBorder />
        <BracketBoxRightTopBorder />
        <BracketBoxNonBorder />
      </BracketRow>
    </div>
  );
};

const Bracket = ({ subgames, nRanks }) => {
  return (
    <>
      {nRanks === 1 && <Bracket2Players subgames={subgames} />}
      {nRanks === 2 && <Bracket4Players subgames={subgames} />}
    </>
  );
};

export default Bracket;
