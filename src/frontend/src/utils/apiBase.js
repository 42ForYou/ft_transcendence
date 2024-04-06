// todo: httpApiBase로 이름 변경

import axios from "axios";
import { API_ENDPOINTS } from "./apiEndpoints";

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// 요청 인터셉터: 요청이 발송되기 전에 로그 기록
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`${config.method.toUpperCase()} 요청 ${config.url} 발송`);
    return config;
  },
  (error) => {
    console.log("요청 발송 실패:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리(리프레시 토큰으로 재발급 시도) 및 성공 로그 기록
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`${response.config.method.toUpperCase()} 요청 ${response.config.url} 성공`);
    return response;
  },
  (error) => {
    const urlObject = new URL(error.config.url, window.location.origin);
    const baseUrl = urlObject.pathname;

    // 2차 인증 요청에 대한 응답 에러 처리
    if (`${baseUrl}/` === API_ENDPOINTS.TWO_FACTOR_VERIFY()) {
      return Promise.reject(error);
    }
    // 리프레시 토큰을 이용한 액세스 토큰 재발급 요청에 대한 응답 에러 처리
    if (!error.config._retry && error.config.url === API_ENDPOINTS.TOKEN_REFRESH) {
      return Promise.reject(error);
    }

    // 일반 API 요청에 대한 응답 에러 처리
    if (!error.config._retry && (error.response.status === 401 || error.response.status === 403)) {
      error.config._retry = true;
      window.dispatchEvent(new CustomEvent("invalid-access-token", { detail: error.config }));
      return Promise.reject(error);
    }

    // 이미 재시도한 경우나 다른 상황에 대해서는 에러를 그대로 반환
    return Promise.reject(error);
  }
);

const get = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getWithoutCredentials = async (url) => {
  try {
    const response = await axiosInstance.get(url, { withCredentials: false });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const post = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, { data });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const put = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const del = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const patch = async (url, data) => {
  try {
    const response = await axiosInstance.patch(url, data);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const patchForm = async (url, formData) => {
  try {
    const response = await axiosInstance.patch(url, formData);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export { axiosInstance, get, getWithoutCredentials, post, put, del, patch, patchForm };
