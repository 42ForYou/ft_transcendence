import React, { useState } from "react";
import ProfileMatchHistory from "./ProfileMatchHistory";
import ProfileSecurity from "./ProfileSecurity";
import { MyProfileInfo, UserProfileInfo } from "./ProfileInfo";
import ProfileFriendButton from "./ProfileFriendButton";
import ProfileStats from "./ProfileStats";
import { useLayout } from "../../context/LayoutContext";

const ProfileBox = ({ isMine, profileData, statsData, matchHistoryData }) => {
  const { isWide } = useLayout();
  const [friendStatus, setFriendStatus] = useState(profileData.friend_status);

  const wideLayout = (
    <div className="ProfileBox d-flex-col flex-grow-1 justify-content-between">
      <div className="d-flex">
        <div className="col mt-4 me-4">
          {isMine ? (
            <MyProfileInfo initProfileData={profileData} />
          ) : (
            <UserProfileInfo profileData={profileData} friendStatus={friendStatus} />
          )}
          {!isMine && (
            <ProfileFriendButton
              initFriendStatus={friendStatus}
              setFriendStatus={setFriendStatus}
              friendId={profileData.friend_id}
              nickname={profileData.nickname}
            />
          )}
        </div>
        <div className="col">
          <ProfileStats statsData={statsData} />
        </div>
      </div>
      <div className="ProfileTrace flex-grow-1 mt-4">
        <ProfileMatchHistory matchHistoryData={matchHistoryData} />
      </div>
      {isMine && (
        <div>
          <ProfileSecurity initIs2FA={profileData.two_factor_auth} />
        </div>
      )}
    </div>
  );
  const narrowLayout = (
    <div className="ProfileBox d-flex-col flex-grow-1">
      {isMine ? (
        <MyProfileInfo initProfileData={profileData} />
      ) : (
        <UserProfileInfo profileData={profileData} friendStatus={friendStatus} />
      )}
      {!isMine && (
        <ProfileFriendButton
          initFriendStatus={friendStatus}
          friendId={profileData.friend_id}
          nickname={profileData.nickname}
          setFriendStatus={setFriendStatus}
        />
      )}
      <div className="ProfileTrace d-flex-col flex-grow-1 mt-4">
        <ProfileStats statsData={statsData} />
        <ProfileMatchHistory matchHistoryData={matchHistoryData} />
      </div>
      {isMine && (
        <div>
          <ProfileSecurity initIs2FA={profileData.two_factor_auth} />
        </div>
      )}
    </div>
  );

  return isWide ? wideLayout : narrowLayout;
};

export default ProfileBox;
