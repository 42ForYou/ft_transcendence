import React from "react";
import UserListBox from "../../components/user_list/UserListBox";
import ContentContainer from "../../components/layout/ContentContainer";
import ContentTitle from "../../components/layout/ContentTitle";
import ContentBody from "../../components/layout/ContentBody";

const UserSearchPage = () => {
  return (
    <div className="UserSearchPage">
      <ContentContainer>
        <ContentTitle title="Users" />
        <ContentBody>
          <UserListBox />
        </ContentBody>
      </ContentContainer>
    </div>
  );
};

export default UserSearchPage;
