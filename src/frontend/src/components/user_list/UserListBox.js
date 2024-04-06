import React from "react";
import ListBox from "../list/ListBox";
import { API_ENDPOINTS } from "../../utils/apiEndpoints";
import UserItem from "./UserItem";

const UserListBox = () => {
  const filterTypes = [{ value: "all", label: "All" }];

  const searchBarProps = {
    searchable: true,
    placeholder: "검색할 유저의 닉네임을 입력하세요",
    validationRegex: /^[a-zA-Z0-9가-힣]{2,16}$/,
    invalidMessage: "검색어는 2~16자의 영문자, 숫자, 한글만 포함할 수 있습니다.",
  };

  return (
    <>
      <ListBox
        apiEndpoint={(_, page, page_size, keyword) => API_ENDPOINTS.USER_SEARCH(page, page_size, keyword)}
        ItemComponent={UserItem}
        filterTypes={filterTypes}
        additionalButton={null}
        emptyMsg="검색 결과가 없습니다."
        itemsPerPage={6}
        itemsPerRow={3}
        searchBarProps={searchBarProps}
      />
    </>
  );
};

export default UserListBox;
