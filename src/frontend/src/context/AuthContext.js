import React, { createContext, useState, useContext, useEffect } from "react";
import { axiosInstance, get, patch, post } from "../utils/apiBase";
import { API_ENDPOINTS } from "../utils/apiEndpoints";
import { useNavigate } from "../lib/rrfs/index.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [is2FA, setIs2FA] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null); // {email, intra_id, two_factor_auth: true}

  const handleUnauthenticated = () => {
    alert("로그인이 필요합니다.");
    navigate("/login");
  };

  const logout = async () => {
    console.log("로그아웃 시도: ");
    try {
      await get(API_ENDPOINTS.LOGOUT);
      console.log("성공");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("토큰을 발급받지 않은 사용자입니다.");
      } else if (error.response?.status === 400) {
        console.log("존재하지 않는 토큰입니다.");
      }
    } finally {
      setLoggedInUser(null);
    }
  };

  const authenticateWithOAuth = async (code) => {
    setIsLoading(true);
    try {
      const resData = await get(API_ENDPOINTS.OAUTH_TOKEN_EXCHANGE(code));
      const user = resData.data.profile;
      setLoggedInUser(user);
    } catch (error) {
      if (error.response?.status === 428) {
        console.log("2FA 인증이 필요한 사용자입니다.");
        setTwoFactorData({
          email: error.response.data.data.email,
          intra_id: error.response.data.data.intra_id,
          two_factor_auth: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateTokenInCookies = async () => {
    setIsLoading(true);
    try {
      const resData = await get(API_ENDPOINTS.TOKEN_VERIFY);
      const user = resData.data.user;
      setLoggedInUser(user);
      setIs2FA(user.two_factor_auth);
    } catch (error) {
      setLoggedInUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    console.log("토큰이 유효하지 않습니다. 리프레시 토큰으로 재시도합니다.");
    setIsLoading(true);
    let success = false;
    try {
      const resData = await post(API_ENDPOINTS.TOKEN_REFRESH);
      setLoggedInUser(resData.data.user);
      console.log("액세스 토큰이 성공적으로 갱신되었습니다.");
      success = true;
    } catch (error) {
      console.log("리프레시 토큰이 만료되었습니다. 로그아웃 처리합니다.");
      setLoggedInUser(null);
      handleUnauthenticated();
    } finally {
      setIsLoading(false);
    }
    return success;
  };

  const resend2FACode = async () => {
    await patch(API_ENDPOINTS.TWO_FACTOR_VERIFY(), { data: { intra_id: twoFactorData.intra_id } });
  };

  const validate2FAcode = async (code2FA) => {
    const resData = await get(API_ENDPOINTS.TWO_FACTOR_VERIFY(twoFactorData.intra_id, code2FA));
    console.log("2FA 인증에 성공했습니다.");
    console.log(resData);
    setLoggedInUser(resData.data.profile);
  };

  // 액세스 토큰이 유효하지 않거나 만료되었을 때 리프레시 토큰을 이용하여 재발급하는 이벤트 핸들러
  // 1. 리프레시 토큰 유효 -> 액세스 토큰 재발급 -> 원본 요청 재시도
  // 2. 리프레시 토큰 만료 -> 로그아웃 처리
  useEffect(() => {
    // console.log("AuthContext가 마운트되었습니다.");
    const handleInvalidAccessToken = async (event) => {
      const isSuccess = await refreshAccessToken();
      // 갱신에 성공했을 경우만 원본 요청을 재시도
      if (isSuccess) {
        console.log("액세스 토큰 재발급에 성공했습니다. 원본 요청을 재시도합니다.");
        const originalRequest = event.detail;
        axiosInstance(originalRequest);
      } else {
        console.log("액세스 토큰 재발급에 실패했습니다.");
      }
    };

    window.addEventListener("invalid-access-token", handleInvalidAccessToken);

    return () => {
      // console.log("AuthContext가 언마운트되었습니다.");
      window.removeEventListener("invalid-access-token", handleInvalidAccessToken);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setLoggedInUser,
        loggedInUser,
        logout,
        validateTokenInCookies,
        validate2FAcode,
        refreshAccessToken,
        authenticateWithOAuth,
        is2FA,
        resend2FACode,
        twoFactorData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
