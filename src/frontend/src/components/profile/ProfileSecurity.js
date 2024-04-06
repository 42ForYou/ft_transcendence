import React, { useState, useEffect } from "react";
import ToggleButton from "../common/ToggleButton";
import usePatchProfile from "../../hooks/usePatchProfile";

const ProfileSecurity = ({ initIs2FA }) => {
  const [is2FA, setIs2FA] = useState(initIs2FA);
  const [loading, setLoading] = useState(false);
  const { patchProfileInfo } = usePatchProfile();

  useEffect(() => {
    setIs2FA(initIs2FA);
  }, [initIs2FA]);

  const handleClick2FAToggle = async () => {
    if (!window.confirm("2차 인증 설정을 변경하시겠습니까?")) return;

    setLoading(true);
    const newIs2FA = !is2FA;

    const res = await patchProfileInfo({ two_factor_auth: newIs2FA });
    if (res.success) {
      setIs2FA(newIs2FA);
      alert("2FA 설정이 성공적으로 변경되었습니다.");
    } else {
      alert("2FA 설정 변경 실패:", res.message);
    }
    setLoading(false);
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("계정을 삭제하면 모든 정보가 사라집니다. 정말 탈퇴하시겠습니까?")) return;
    alert("계정 탈퇴 미구현");
  };

  return (
    <div className="ProfileSecurity d-flex justify-content-end mt-4">
      <span className="me-2">2FA</span>
      <ToggleButton label="2FA" isToggled={is2FA} onToggle={handleClick2FAToggle} loading={loading} />
      {/* <BootstrapButton styleType="danger" onClick={handleDeleteAccount} name="Delete" /> */}
    </div>
  );
};

export default ProfileSecurity;
