import React from "react";
import CustomButton from "../common/CustomButton";
import { useLayout } from "../../context/LayoutContext";

const ProfileEditButtons = ({ isEditing, onExitClick, onSubmitClick, onEntryClick }) => {
  const { isWide } = useLayout();
  return (
    <div className={isWide ? "mt-3 text-end" : "text-center"}>
      {isEditing ? (
        <>
          <CustomButton label={"확인"} color={"green"} onClick={onSubmitClick} />{" "}
          <CustomButton label={"취소"} color={"red"} onClick={onExitClick} />
        </>
      ) : (
        <CustomButton label={"정보 수정"} color={"blue"} onClick={onEntryClick} />
      )}
    </div>
  );
};

export default ProfileEditButtons;
