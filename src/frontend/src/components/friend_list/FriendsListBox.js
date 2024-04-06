import React from "react";

import FriendItem from "./FriendItem";
import ListBox from "../list/ListBox";
import { API_ENDPOINTS } from "../../utils/apiEndpoints";
import { useLayout } from "../../context/LayoutContext";

const FriendsListBox = () => {
  const { isWide } = useLayout();
  const filterTypes = [
    { value: "friend", label: "나의 친구" },
    { value: "pending", label: "내게 온 친구요청" },
  ];

  return (
    <>
      <ListBox
        apiEndpoint={API_ENDPOINTS.FRIENDS}
        ItemComponent={FriendItem}
        filterTypes={filterTypes}
        emptyMsg={"친구 데이터가 없습니다."}
        itemsPerPage={6}
        itemsPerRow={isWide ? 3 : 2}
      />
    </>
  );
};

export default FriendsListBox;
