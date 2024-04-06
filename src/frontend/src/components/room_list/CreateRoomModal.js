import React, { useEffect, useState } from "react";
import { useNavigate } from "../../lib/rrfs/index.js";
import CustomModal from "../common/CustomModal";
import { useAuth } from "../../context/AuthContext";
import { post } from "../../utils/apiBase";
import { API_ENDPOINTS } from "../../utils/apiEndpoints";
import RadioSelector from "../common/RadioSelector";
import DropdownSelector from "../common/DropdownSelector";
import { hasKeys, updateProperty } from "../../utils/objectUtils";
import BootstrapButton from "../common/BootstrapButton";

const RoomTitleForm = ({ roomTitle, setRoomTitle, isValid }) => {
  return (
    <div className="form-group">
      <label htmlFor="roomTitle">
        <b>방 제목</b>
      </label>
      <input
        type="text"
        className={`form-control ${!isValid ? "is-invalid" : ""}`}
        id="roomTitle"
        placeholder="방 제목을 입력하세요"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
      />
      {!isValid && <div className="invalid-feedback">한글, 알파벳, 숫자를 포함한 20자 이내 문자열만 가능합니다.</div>}
    </div>
  );
};

const RoomModeSelectForm = ({ updateRoomData }) => {
  const modeOptions = [
    { value: "dual", label: "1vs1" },
    { value: "tournament", label: "토너먼트" },
  ];

  useEffect(() => {
    updateRoomData("game.is_tournament", false);
    updateRoomData("game.n_players", 2);
  }, []);

  const handleModeChange = (value) => {
    const isTournament = value === "tournament";
    updateRoomData("game.is_tournament", isTournament);
    updateRoomData("game.n_players", isTournament ? 4 : 2);
  };

  return <RadioSelector title="모드 선택" options={modeOptions} reflectSelect={handleModeChange} />;
};

const RoomGameOptionForm = ({ updateRoomData }) => {
  const scoreOptions = [
    { value: 3, label: "3점" },
    { value: 5, label: "5점" },
    { value: 10, label: "10점" },
  ];
  const timeOptions = [
    { value: 30, label: "30초" },
    { value: 60, label: "60초" },
    { value: 90, label: "90초" },
  ];

  useEffect(() => {
    updateRoomData("game.game_point", scoreOptions[0].value);
    updateRoomData("game.time_limit", timeOptions[0].value);
  }, []);

  const handleScoreChange = (value) => {
    updateRoomData("game.game_point", value);
  };

  const handleTimeChange = (value) => {
    updateRoomData("game.time_limit", value);
  };

  return (
    <>
      <div className="col">
        <DropdownSelector title={"목표 득점"} options={scoreOptions} reflectSelect={handleScoreChange} />
      </div>
      <div className="col">
        <DropdownSelector title={"제한 시간"} options={timeOptions} reflectSelect={handleTimeChange} />
      </div>
    </>
  );
};

const CreateRoomModal = ({ handleClose }) => {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({});
  const [roomTitle, setRoomTitle] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleUpdateRoomData = (path, value) => {
    setRoomData((prevRoomData) => updateProperty(prevRoomData, path, value));
  };

  const handleSubmit = () => {
    const isValidTitle = /^[a-zA-Z0-9\u3131-\uD79D\s]{1,20}$/.test(roomTitle);
    const postRoomData = async () => {
      try {
        const resData = await post(API_ENDPOINTS.ROOM_LIST(), roomData);
        const waitingRoomData = resData.data;
        navigate(`/game/waiting/${waitingRoomData.room.id}`);
        handleClose();
        console.log("방 생성 요청 성공");
      } catch (error) {
        console.log("방 생성 요청 실패:", error);
        alert("방 생성에 실패하였습니다.");
      }
    };
    setIsValid(isValidTitle);

    if (!isValidTitle) {
      return; // 유효하지 않으면 여기서 처리를 중단
    }

    if (
      isValidTitle &&
      hasKeys(roomData, ["game.is_tournament", "game.time_limit", "game.game_point", "game.n_players"])
    ) {
      postRoomData();
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  useEffect(() => {
    handleUpdateRoomData("room.title", roomTitle);
  }, [roomTitle]);

  useEffect(() => {
    setRoomTitle(`${loggedInUser.nickname}의 게임 방`);
  }, []);

  return (
    <CustomModal
      hasCloseButton={false}
      handleClose={handleClose}
      title={"새로운 게임 방 만들기"}
      footerButtons={
        <>
          <BootstrapButton label={"취소"} styleType={"secondary"} onClick={handleClose} />
          <BootstrapButton label={"확인"} styleType={"primary"} onClick={handleSubmit} />
        </>
      }>
      <form>
        <div className="row">
          <RoomTitleForm roomTitle={roomTitle} setRoomTitle={setRoomTitle} isValid={isValid} setIsValid={setIsValid} />
        </div>
        <div className="row mt-3">
          <RoomModeSelectForm updateRoomData={handleUpdateRoomData} />
        </div>
        <div className="row mt-3">
          <RoomGameOptionForm updateRoomData={handleUpdateRoomData} />
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateRoomModal;
