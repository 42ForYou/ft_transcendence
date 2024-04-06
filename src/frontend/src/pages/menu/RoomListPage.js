import React from "react";
import RoomListBox from "../../components/room_list/RoomListBox";
import ContentContainer from "../../components/layout/ContentContainer";
import ContentTitle from "../../components/layout/ContentTitle";
import ContentBody from "../../components/layout/ContentBody";

const RoomListPage = () => {
  return (
    <div className="RoomListPage">
      <ContentContainer>
        <ContentTitle title="Game Rooms" />
        <ContentBody>
          <RoomListBox />
        </ContentBody>
      </ContentContainer>
    </div>
  );
};

export default RoomListPage;
