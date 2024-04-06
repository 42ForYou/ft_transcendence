import React from "react";
import FriendsListBox from "../../components/friend_list/FriendsListBox";
import ContentContainer from "../../components/layout/ContentContainer";
import ContentTitle from "../../components/layout/ContentTitle";
import ContentBody from "../../components/layout/ContentBody";

const FriendsPage = () => {
  return (
    <div className="FriendsPage">
      <ContentContainer>
        <ContentTitle title="Friends" />
        <ContentBody>
          <FriendsListBox />
        </ContentBody>
      </ContentContainer>
    </div>
  );
};

export default FriendsPage;
