import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "../../lib/rrfs/index.js";
import { useAuth } from "../../context/AuthContext";
import LoadingPage from "../LoadingPage";

const TwoFactorAuthPage = () => {
  const { validate2FAcode, resend2FACode, loggedInUser, twoFactorData, isLoading } = useAuth();
  const [code2FA, setCode2FA] = useState("");
  const [status2FA, setStatus2FA] = useState("");
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(180); // 제한 시간 3분
  const [timerMessage, setTimerMessage] = useState(`제한시간: ${countdown}초`);

  useEffect(() => {
    if (loggedInUser) {
      alert("이미 로그인 된 상태입니다.");
      navigate("/");
    } else if (!twoFactorData) {
      alert("잘못된 접근입니다.");
      navigate("/login");
    }

    // 카운트다운 시작
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        const newCountdown = prevCountdown - 1;
        setTimerMessage(`제한시간: ${newCountdown}초`);
        return newCountdown;
      });
    }, 1000);

    // 카운트다운 종료
    return () => clearInterval(interval);
  }, [navigate, loggedInUser, twoFactorData]);

  useEffect(() => {
    if (countdown <= 0) {
      setTimerMessage("인증 시간이 초과되었습니다. 코드를 재전송해주세요.");
      setStatus2FA("");
      setIsProcessing(false);
    }
  }, [countdown]);

  const handle2FAcodeSubmit = async () => {
    if (code2FA.length === 0) {
      alert("코드를 입력해주세요.");
      return;
    } else if (!code2FA.match(/^[a-zA-Z0-9]+$/)) {
      alert("영문과 숫자만 입력 가능합니다.");
      return;
    }

    setStatus2FA("");
    try {
      setIsProcessing(true);
      await validate2FAcode(code2FA);
      navigate("/");
    } catch (error) {
      setStatus2FA("2차 인증에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResend2FACode = async () => {
    try {
      setIsProcessing(true);
      await resend2FACode();
      setCountdown(180); // 타이머 리셋
      setTimerMessage("제한시간: 180초");
      setStatus2FA("2차 인증 코드가 재전송되었습니다. 이메일을 확인해주세요.");
    } catch (error) {
      setStatus2FA("2차 인증 코드 재전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="LoginPage">
      <div>
        <h3 style={{ textShadow: "2px 2px 4px #000000" }}>
          {twoFactorData.email}로<br />
          2차 인증 코드가 전송되었습니다.
        </h3>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            placeholder="코드를 입력하세요"
            value={code2FA}
            onChange={(e) => setCode2FA(e.target.value)}
          />
          <button className="twoFactorSubmit mx-1" onClick={handle2FAcodeSubmit}>
            제출
          </button>
          <button className="twoFactorResend" onClick={handleResend2FACode}>
            재전송
          </button>
        </div>
        <div className="mt-3 twoFactorMessage">
          <p style={{ textShadow: "2px 2px 4px #000000" }}>{timerMessage}</p>
          <p style={{ textShadow: "2px 2px 4px #000000" }}>
            {isProcessing ? "처리 중입니다. 잠시만 기다려주세요..." : status2FA}
          </p>
        </div>
      </div>
      <Link to="/login" className="back-to-login-link">
        로그인 페이지로 돌아가기
      </Link>
    </div>
  );
};

export default TwoFactorAuthPage;
