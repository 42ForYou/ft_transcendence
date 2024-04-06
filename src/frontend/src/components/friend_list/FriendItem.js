import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import { del, patch } from "../../utils/apiBase";
import { API_ENDPOINTS } from "../../utils/apiEndpoints";
import { useOnlineStatus } from "../../context/OnlineStatusContext";
import CustomButton from "../common/CustomButton";
import { Link } from "../../lib/rrfs/index.js";

const FriendItem = ({ id: friend_id, status, friend, onOccurChange }) => {
  console.log(status, friend);
  const { intra_id, nickname, avatar } = friend;
  const [currentIsOnline, setCurrentIsOnline] = useState(friend.is_online);
  const onlineStatuses = useOnlineStatus();

  useEffect(() => {
    if (onlineStatuses.hasOwnProperty(intra_id)) {
      setCurrentIsOnline(onlineStatuses[intra_id]);
    }
  }, [onlineStatuses, intra_id]);

  const handleAcceptFriend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const patchFriend = async () => {
      try {
        const resData = await patch(`${API_ENDPOINTS.FRIENDS()}${friend_id}/`);
        onOccurChange();
        alert("친구 요청을 수락하였습니다.");
        console.log("친구 요청 수락 성공:", resData);
      } catch (error) {
        console.log("친구 요청 수락 실패:", error);
        alert("친구 요청 수락에 실패하였습니다.");
      }
    };
    patchFriend();
  };

  const handleRejectFriend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const delFriend = async () => {
      try {
        const resData = await del(`${API_ENDPOINTS.FRIENDS()}${friend_id}/`);
        onOccurChange();
        console.log("친구 삭제 성공", resData);
      } catch (error) {
        console.log("친구 삭제 실패:", error);
        alert("친구 삭제에 실패하였습니다.");
      }
    };

    let confirmMsg = "";
    if (status === "pending") {
      confirmMsg = "친구 요청을 거절하시겠습니까?";
    } else if (status === "friend") {
      confirmMsg = "친구를 삭제하시겠습니까?";
    }
    if (window.confirm(confirmMsg)) {
      delFriend();
    }
  };

  const getOnlineStatus = () => {
    if (status !== "friend") return;
    if (currentIsOnline) return "online";
    else return "offline";
  };

  return (
    <div className="FriendItem w-100 p-0">
      <Link to={`/profile/users/${intra_id}`}>
        <div className="p-3">
          <div className="row ps-3 pe-3">
            <div className="col d-flex justify-content-center">
              <Avatar src={avatar} alt={`친구 ${nickname}의 아바타`} onlineStatus={getOnlineStatus()} diameter={120} />
            </div>
            <div className="col d-flex-col justify-content-between align-items-center my-2">
              {nickname}
              <div className="text-end mt-2">
                {status === "pending" && (
                  <div className="d-flex">
                    <div className="me-2">
                      <CustomButton color={"blue"} label={"수락"} onClick={(e) => handleAcceptFriend(e)} />
                    </div>
                    <CustomButton color={"red"} label={"거절"} onClick={(e) => handleRejectFriend(e)} />
                  </div>
                )}
                {status === "friend" && (
                  <>
                    <CustomButton color={"red"} label={"친구 삭제"} onClick={handleRejectFriend} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FriendItem;
