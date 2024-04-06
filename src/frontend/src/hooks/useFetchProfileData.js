import { useState, useEffect } from "react";
import { get } from "../utils/apiBase";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

// 특정 사용자의 프로필 데이터를 비동기적으로 가져오는 커스텀 훅
// 이 훅을 사용하는 컴포넌트가 마운트될 때 자동으로 데이터를 가져와야 하므로 useEffect를 사용
const useFetchProfileData = (intraId) => {
  const [profileData, setProfileData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [matchHistoryData, setMatchHistoryData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setError(null);
      try {
        const resDataProfile = await get(API_ENDPOINTS.USER_PROFILE(intraId));
        const resDataStats = await get(API_ENDPOINTS.USER_STATS(intraId));
        const resDataHistory = await get(API_ENDPOINTS.USER_HISTORY(intraId));
        setProfileData(resDataProfile.data.user);
        setStatsData(resDataStats);
        setMatchHistoryData(resDataHistory);
      } catch (error) {
        setError({
          code: error.response?.status,
          msg: error.response?.data.message || error.message,
        });
      }
    };

    if (intraId) {
      fetchProfileData();
    }
  }, [intraId]);

  return { profileData, statsData, matchHistoryData, error };
};

export default useFetchProfileData;
