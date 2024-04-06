import React from "react";
import { useGame } from "../../context/GameContext";
import CustomButton from "../common/CustomButton";

const StartGameButton = ({ isActive }) => {
  const { emitRoomSocket } = useGame();

  const handleStartGame = () => {
    if (!window.confirm("게임을 시작하시겠습니까?")) return;
    emitRoomSocket("start");
  };

  return (
    <CustomButton
      color={"dark-blue"}
      label={"START"}
      onClick={isActive ? handleStartGame : null}
      overrideStyle={{
        width: "150px",
        height: "50px",
        fontSize: "30px",
        padding: "0px 24px",
      }}
      disabled={!isActive}
      opacity={isActive ? 1 : 0.5}
    />
  );
};

export default StartGameButton;
