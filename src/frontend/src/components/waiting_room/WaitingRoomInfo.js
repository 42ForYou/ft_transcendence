import React from "react";

const WaitingRoomInfo = ({ title, host, point, time, nPlayers, joinPlayers }) => {
  return (
    <div className="WaitingRoomInfo d-flex justify-content-between border p-3">
      <div className="d-flex align-items-center ms-3">
        <p className="title me-3">{title}</p>
        <p>
          ( {joinPlayers} / {nPlayers} )
        </p>
      </div>
      <p className="d-flex justify-content-end">
        목표 득점: {point}점
        <br />
        제한 시간: {time}초
      </p>
    </div>
  );
};

export default WaitingRoomInfo;
