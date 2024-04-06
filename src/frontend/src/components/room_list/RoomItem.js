import React from "react";
import BootstrapButton from "../common/BootstrapButton";
import { post } from "../../utils/apiBase";
import { API_ENDPOINTS } from "../../utils/apiEndpoints";
import { useNavigate } from "../../lib/rrfs/index.js";
import CustomButton from "../common/CustomButton";
import Icon from "../common/Icon";
import { useLayout } from "../../context/LayoutContext";

const RoomItemDetail = ({ label, value }) => (
  <div className="room-detail">
    <span className="room-detail-label">{label}</span>
    <span className="room-detail-value">| {value}</span>
  </div>
);
// 스타일을 가지는 박스
// 일단은 1대1도 토너먼트 스타일과 통일
const RoomItem = ({ game, room }) => {
  const navigate = useNavigate();
  const { game_id, is_tournament, game_point, time_limit, n_players } = game;
  const { id: room_id, title, is_playing, join_players, host } = room;
  const cannotJoin = is_playing || join_players === n_players;
  const { isWide } = useLayout();

  const handleJoinClick = (gameId) => {
    const postJoinRequest = async () => {
      try {
        const resData = await post(API_ENDPOINTS.PLAYERS(), { game_id: gameId });
        navigate(`/game/waiting/${room_id}`);
        console.log("방 참가 요청 성공: ", resData);
      } catch (error) {
        console.log("방 참가 요청 실패: ", error);
        const errorReason = error.response.data.error;
        let alertMsg;
        // todo: 에러 케이스 제대로 출력되는지 확인
        if (errorReason === "The game room is full") alertMsg = "게임 방 인원이 모두 찼습니다.";
        else if (errorReason === "The player is already participating") alertMsg = "이미 참가한 방입니다.";
        else if (errorReason === "The game room is already started") alertMsg = "게임이 이미 시작된 방입니다.";
        else alertMsg = "게임 방에 입장할 수 없습니다.";
        alert(alertMsg);
      }
    };
    postJoinRequest();
  };

  return (
    <div className={`RoomItem ${cannotJoin ? "cannot-join" : "can-join"} w-100 p-3`}>
      <div className="row ps-3 pe-3">
        <div className="row border-bottom pb-3 d-flex align-items-end justify-content-between p-0 mb-2">
          <div className="col-9 d-flex">
            <h5 className="fst-italic">{title}</h5>
          </div>
          <div className="col text-end p-0">
            {isWide && <Icon filename={is_tournament ? "tournament.png" : "versus.png"} alt={"logout"} invert={true} />}
            <CustomButton
              label={"JOIN"}
              onClick={() => handleJoinClick(game_id)}
              disabled={cannotJoin}
              opacity={1}
              color={"dark-green"}
            />
          </div>
        </div>
        <RoomItemDetail label="방장" value={host} />
        <RoomItemDetail label="참여 인원" value={`${join_players} / ${n_players}`} />
        <RoomItemDetail label="목표 득점" value={`${game_point}점`} />
        <RoomItemDetail label="제한 시간" value={`${time_limit}초`} />
      </div>
    </div>
  );
};

export default RoomItem;
