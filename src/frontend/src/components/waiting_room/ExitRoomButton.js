import React from "react";
import { useNavigate } from "../../lib/rrfs/index.js";
import CustomButton from "../common/CustomButton";

const ExitRoomButton = () => {
  const navigate = useNavigate();

  const handleNormalExit = async () => {
    if (!window.confirm("게임 대기 방을 나가시겠습니까?")) return;
    navigate("/game/list");
    console.log("방 나가기 성공");
  };

  return (
    <CustomButton
      color="dark-red"
      label={"EXIT"}
      onClick={handleNormalExit}
      overrideStyle={{
        width: "120px",
        height: "50px",
        fontSize: "30px",
        padding: "0px 24px",
      }}
      opacity={1}
    />
  );
};

export default ExitRoomButton;
