import React, { useEffect } from "react";
import { useLocation, useNavigate } from "../../lib/rrfs/index.js";
import { useAuth } from "../../context/AuthContext";

const OAuthCallbackPage = () => {
  const queryParams = new URLSearchParams(useLocation().search);
  const code = queryParams.get("code");
  const { authenticateWithOAuth, loggedInUser, isLoading, twoFactorData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    authenticateWithOAuth(code);
  }, [code]);

  useEffect(() => {
    if (isLoading) return;

    if (loggedInUser) {
      navigate("/");
    } else if (twoFactorData?.two_factor_auth) {
      navigate("/login/2fa");
    } else {
      alert("잘못된 접근입니다.");
      navigate("/login");
    }
  }, [isLoading, twoFactorData, loggedInUser, navigate]);

  return (
    <div className="CallbackPage">
      <div>서버로부터 응답을 기다리고 있습니다...</div>
    </div>
  );
};

export default OAuthCallbackPage;
