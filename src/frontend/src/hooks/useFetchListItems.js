import { useState } from "react";
import { get } from "../utils/apiBase";

// 필터, 페이지, 키워드를 넘겨받아 API를 호출하고 결과를 반환하는 커스텀 훅
const useFetchListItems = (apiEndpoint, fetchLimit) => {
  const [itemsData, setItemsData] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListItems = async (currentFilter, currentPage, searchKeyword) => {
    setIsLoading(true);
    setError(null);
    try {
      const resData = await get(apiEndpoint(currentFilter.value, currentPage, fetchLimit, searchKeyword));
      setItemsData(resData.data);
      setTotalPage(resData.pages.total_pages);
      setIsLoading(false);
    } catch (error) {
      setItemsData(null);
      setError({
        code: error.response?.status,
        msg: error.response?.data.message || error.message,
      });
      setIsLoading(false);
    }
  };

  return { itemsData, totalPage, isLoading, error, fetchListItems };
};

export default useFetchListItems;
