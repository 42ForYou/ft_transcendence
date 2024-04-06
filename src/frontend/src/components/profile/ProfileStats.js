import React from "react";
import BarChart from "../common/BarChart";

const processData = (stats) => {
  // 모드 비율 데이터 생성
  const modeData = [
    { percent: stats.n_tournaments, label: "Tournaments", color: "#FFB6C1" },
    { percent: stats.n_dual_match, label: "1vs1", color: "#ADD8E6" },
  ];

  // 1vs1 승패 비율 데이터 생성
  const dualData = [
    { percent: stats.n_dual_wins, label: "Wins", color: "#90EE90" },
    { percent: stats.n_dual_looses, label: "Losses", color: "#FF6F61" },
  ];

  // 토너먼트 최종 랭크 비율 데이터 생성
  const rankDataAggregated = {};
  stats.tournament_stats.forEach((tournament) => {
    tournament.stats.forEach((stat) => {
      const label =
        stat.final_rank === -1 ? "우승" : stat.final_rank === 0 ? "결승전" : `${2 ** (stat.final_rank + 1)}강`;
      if (!rankDataAggregated[label]) {
        rankDataAggregated[label] = {
          percent: 0,
          label: label,
          color: randomColor(),
        };
      }

      rankDataAggregated[label].percent += stat.n_tournaments;
    });
  });

  if (rankDataAggregated["우승"]) {
    rankDataAggregated["우승"].color = "#FFD700";
  }
  if (rankDataAggregated["결승전"]) {
    rankDataAggregated["결승전"].color = "#C0C0C0";
  }
  if (rankDataAggregated["4강"]) {
    rankDataAggregated["4강"].color = "#CD7F32";
  }

  const rankData = Object.values(rankDataAggregated);

  return { modeData, dualData, rankData };
};

const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const BarChartSection = ({ title, chartData }) => {
  return (
    <div className="text-center" style={{ width: "33%", display: "flex", flexDirection: "column", padding: "10px" }}>
      <h5>&lt;{title}&gt;</h5>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "200px" }}>
        {chartData ? <BarChart data={chartData} /> : <p>데이터가 없습니다.</p>}
      </div>
    </div>
  );
};

const ProfileStats = ({ statsData }) => {
  const { modeData, dualData, rankData } = processData(statsData);
  const { n_dual_match, n_tournaments } = statsData;

  return (
    <div className="ProfileStats ContentContainer Content">
      <h4 className="mb-4">Statistics</h4>
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <BarChartSection title="플레이한 모드" chartData={n_dual_match + n_tournaments === 0 ? null : modeData} />
        <BarChartSection title="1vs1 승/패" chartData={n_dual_match === 0 ? null : dualData} />
        <BarChartSection title="토너먼트 성적" chartData={n_tournaments === 0 ? null : rankData} />
      </div>
    </div>
  );
};
export default ProfileStats;
