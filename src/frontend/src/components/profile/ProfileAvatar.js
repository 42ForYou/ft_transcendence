import React, { useRef, useState } from "react";
import { STATUS } from "./ProfileInfo";
import usePatchProfile from "../../hooks/usePatchProfile";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";
import { useLayout } from "../../context/LayoutContext";

const HiddenImageUploader = ({ imgInputRef, handleAvatarChange }) => {
  return (
    <input type="file" ref={imgInputRef} style={{ display: "none" }} accept="image/*" onChange={handleAvatarChange} />
  );
};

const ProfileAvatar = ({ avatar, nickname, isEditing = false, setEditStatus }) => {
  const { patchProfileInfo } = usePatchProfile();
  const { setLoggedInUser } = useAuth();
  const [newAvatar, setNewAvatar] = useState(avatar);
  const imgInputRef = useRef(null);
  const { isWide } = useLayout();

  const handleAvatarUploadClick = () => {
    if (imgInputRef.current) {
      imgInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("파일을 선택해주세요");
      return;
    }
    const editStatusMsg = ["", "", "", ""];
    const result = await patchProfileInfo(
      file,
      (updatedProfile) => {
        console.log("업데이트 결과: ", updatedProfile);
        setNewAvatar(updatedProfile.avatar);
        setLoggedInUser(updatedProfile);
      },
      true
    );

    if (result.success) {
      editStatusMsg[STATUS.PROFILE] = "아바타가 성공적으로 업로드 되었습니다.";
    } else editStatusMsg[STATUS.PROFILE] = "아바타 업로드가 실패하였습니다.";
    setEditStatus(editStatusMsg);
  };

  return (
    <div className={`ProfileAvatar ${isWide ? "d-flex justify-content-center mb-3" : "ms-5"}`}>
      <Avatar
        src={newAvatar}
        alt={`${nickname}'s avatar`}
        isEditing={isEditing}
        onImageUploadClick={handleAvatarUploadClick}
        diameter={130}
      />
      {isEditing && <HiddenImageUploader imgInputRef={imgInputRef} handleAvatarChange={handleAvatarChange} />}
    </div>
  );
};

export default ProfileAvatar;
