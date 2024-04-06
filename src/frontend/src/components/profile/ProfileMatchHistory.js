import React from "react";

// todo: 서브게임 리스트에서 일부만 잘라 띄우거나 클릭하면 모달로 띄우기

const MatchHistoryTable = ({ matchHistoryData }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getMode = (game) => (game.is_tournament ? "토너먼트" : "1vs1");

  const getRank = (rank) => {
    if (rank === -1) return "우승";
    if (rank === 0) return "결승전";
    return `${2 ** (rank + 1)}강`;
  };

  const getGameOption = (game) => `목표 득점: ${game.game_point}점, 제한 시간 ${game.time_limit}초`;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>일시</th>
          <th>모드</th>
          <th>라운드</th>
          <th>게임 옵션</th>
          <th>최종 득점</th>
          <th>승리여부</th>
        </tr>
      </thead>
      <tbody>
        {matchHistoryData.map((gameData) =>
          gameData.subgames.map((subgame, index) => (
            <tr key={`${gameData.game.game_id}_${index}`}>
              <td>{formatDate(subgame.t_start)}</td>
              <td>{getMode(gameData.game)}</td>
              <td>{gameData.game.is_tournament ? getRank(subgame.rank) : ""}</td>
              <td>{getGameOption(gameData.game)}</td>
              <td>{`${subgame.point_a} : ${subgame.point_b}`}</td>
              <td>{subgame.game_player_won ? "WIN" : "LOSE"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

const ProfileMatchHistory = ({ matchHistoryData }) => {
  return (
    <div className="ProfileMatchHistory ContentContainer Content mt-4">
      <h4 className="mb-4">Match History</h4>
      <MatchHistoryTable matchHistoryData={matchHistoryData} />
    </div>
  );
};

export default ProfileMatchHistory;
