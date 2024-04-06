import React, { useEffect } from "react";
import PongScene from "../../components/game/PongScene";
import { useGame } from "../../context/GameContext";
import LoadingPage from "../LoadingPage";
import PongStatus from "../../components/game/PongStatus";

const PongScenePage = () => {
  const { tournamentConfig, emitSubgameSocket } = useGame();

  if (!tournamentConfig) return <LoadingPage loadingMsg="게임 데이터를 불러오는 중입니다..." />;

  // 키를 누르고 떼는 이벤트를 감지하여 서버로 전송
  useEffect(() => {
    // console.log("키 이벤트 전송을 위한 이벤트 리스너 설정");
    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp") {
        // console.log("Arrow Up key pressed");
        emitSubgameSocket("keyboard_input", { key: "UP", action: "PRESS" });
      } else if (event.key === "ArrowDown") {
        // console.log("Arrow Down key pressed");
        emitSubgameSocket("keyboard_input", { key: "DOWN", action: "PRESS" });
      }
    };

    const handleKeyRelease = (event) => {
      if (event.key === "ArrowUp") {
        // console.log("Arrow Up key released");
        emitSubgameSocket("keyboard_input", { key: "UP", action: "RELEASE" });
      } else if (event.key === "ArrowDown") {
        // console.log("Arrow Down key released");
        emitSubgameSocket("keyboard_input", { key: "DOWN", action: "RELEASE" });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      // console.log("키 이벤트 전송을 위한 이벤트 리스너 해제");
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, []);

  return (
    <div className="PongScenePage">
      <PongStatus />
      <PongScene />
    </div>
  );
};

export default PongScenePage;
