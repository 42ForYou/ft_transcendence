import React, { useEffect, useState } from "react";
import usePatchProfile from "../../hooks/usePatchProfile";
import { checkRegex } from "../../utils/checkRegex";
import ProfileAvatar from "./ProfileAvatar";
import ProfileTextLine from "./ProfileTextLine";
import ProfileEditButtons from "./ProfileEditButtons";
import { useLayout } from "../../context/LayoutContext";
import { useAuth } from "../../context/AuthContext";

export const STATUS = {
  PROFILE: 0,
  NICKNAME: 1,
  EMAIL: 2,
};

const getFriendStatusString = (status) => {
  switch (status) {
    case "None":
      return "친구 아님";
    case "pending":
      return "친구 아님 (대기중)";
    case "friend":
      return "친구";
    default:
      return "알 수 없음";
  }
};

const InfoDisplay = ({ profileData, isEditing, onChangeNickname, onChangeEmail, friendStatus, setEditStatus }) => {
  const { isWide } = useLayout();
  const [friendStatusString, setFriendStatusString] = useState(getFriendStatusString(friendStatus));

  useEffect(() => {
    setFriendStatusString(() => getFriendStatusString(friendStatus));
  }, [friendStatus]);

  if (isWide) {
    return (
      <div className="d-flex-col">
        <ProfileAvatar
          avatar={profileData.avatar}
          nickname={profileData.nickname}
          isEditing={isEditing}
          setEditStatus={setEditStatus}
        />
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">
            {profileData.intraId && <ProfileTextLine label="Intra ID" value={profileData.intraId} />}
            <ProfileTextLine
              label="Nickname"
              value={profileData.nickname}
              isEditing={isEditing}
              onChange={onChangeNickname}
            />
            {(profileData.email || isEditing) && (
              <ProfileTextLine label="Email" value={profileData.email} isEditing={isEditing} onChange={onChangeEmail} />
            )}
            {profileData.friend_status && <ProfileTextLine label="Friend Status" value={friendStatusString} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="flex-grow-1">
        {profileData.intraId && <ProfileTextLine label="Intra ID" value={profileData.intraId} />}
        <ProfileTextLine
          label="Nickname"
          value={profileData.nickname}
          isEditing={isEditing}
          onChange={onChangeNickname}
        />
        {(profileData.email || isEditing) && (
          <ProfileTextLine label="Email" value={profileData.email} isEditing={isEditing} onChange={onChangeEmail} />
        )}
        {profileData.friend_status && <ProfileTextLine label="Friend Status" value={friendStatusString} />}
      </div>
      <ProfileAvatar
        avatar={profileData.avatar}
        nickname={profileData.nickname}
        isEditing={isEditing}
        setEditStatus={setEditStatus}
      />
    </div>
  );
};

export const MyProfileInfo = ({ initProfileData }) => {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const { nickname: initNickname, email: initEmail } = initProfileData;
  const { patchProfileInfo } = usePatchProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState(null);
  const [nickname, setNickname] = useState(initNickname);
  const [email, setEmail] = useState(initEmail);
  const { isWide } = useLayout();

  const handleEntryEditClick = () => {
    setIsEditing(true);
    setEditStatus(null);
  };

  const handleExitEditClick = () => {
    setIsEditing(false);
    setEditStatus(null);
    setNickname(initNickname);
    setEmail(initEmail);
  };

  const validateProfile = (nickname, email) => {
    const validations = {
      nickname: checkRegex(nickname, /^[a-zA-Z0-9가-힣]{2,16}$/),
      email: checkRegex(email, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
    };

    const validateMsg = [
      validations.nickname
        ? ""
        : "유효하지 않은 형식의 닉네임입니다. (한글, 영어, 숫자로 이루어진 2~16자의 문자열만 허용)",
      validations.email ? "" : "유효하지 않은 형식의 이메일입니다.",
    ];

    return { isValid: validations.nickname && validations.email, validateMsg };
  };

  const handleSubmitEditClick = async () => {
    const isChangeExist = !(nickname === initNickname && email === initEmail);
    const { isValid, validateMsg } = validateProfile(nickname, email);
    const editStatusMsg = ["", "", ""]; // STATUS에 따라 메시지를 저장할 배열 초기화

    if (!isChangeExist) {
      setIsEditing(false);
      return;
    }

    if (!isValid) {
      validateMsg.forEach((msg) => {
        if (msg) alert(msg);
      });
      return;
    }

    try {
      const result = await patchProfileInfo({ nickname, email });
      if (result.success) {
        setIsEditing(false);
        editStatusMsg[STATUS.PROFILE] = "프로필 정보가 성공적으로 업데이트 되었습니다.";
        setLoggedInUser({ ...loggedInUser, nickname, email });
      } else {
        editStatusMsg[STATUS.PROFILE] = "프로필 정보 업데이트가 실패하였습니다.";
        if (result.errmsg && typeof result.errmsg === "object") {
          if (result.errmsg.nickname) {
            editStatusMsg[STATUS.NICKNAME] = "이미 사용 중인 닉네임입니다.";
          }
          if (result.errmsg.email) {
            editStatusMsg[STATUS.EMAIL] = "이미 사용 중인 이메일입니다.";
          }
        }
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      editStatusMsg[STATUS.PROFILE] = "프로필 정보 업데이트 중 오류가 발생했습니다.";
    } finally {
      setEditStatus(editStatusMsg.filter((msg) => msg));
    }
  };

  return (
    <div className="ProfileInfo">
      <InfoDisplay
        profileData={{ ...initProfileData, nickname, email }}
        isEditing={isEditing}
        onChangeNickname={setNickname}
        onChangeEmail={setEmail}
        setEditStatus={setEditStatus}
      />
      <ProfileEditButtons
        isEditing={isEditing}
        onEntryClick={handleEntryEditClick}
        onExitClick={handleExitEditClick}
        onSubmitClick={handleSubmitEditClick}
      />
      {editStatus && (
        <div className={`mt-2 ${isWide ? "text-end" : "text-center"}`}>
          {editStatus.map((status, i) => (
            <div key={i}>{status}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export const UserProfileInfo = ({ profileData, friendStatus }) => (
  <div className="ProfileInfo">
    <div className="col"></div>
    <div className="col">
      <InfoDisplay profileData={profileData} friendStatus={friendStatus} />
    </div>
  </div>
);

const ProfileInfo = ({ isMine, profileData }) => {
  return isMine ? <MyProfileInfo initProfileData={profileData} /> : <UserProfileInfo profileData={profileData} />;
};

export default ProfileInfo;
