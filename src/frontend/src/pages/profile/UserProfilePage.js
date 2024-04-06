import React, { useEffect } from "react";
import ProfileBox from "../../components/profile/ProfileBox";
import { useParams, useNavigate } from "../../lib/rrfs/index.js";
import LoadingPage from "../LoadingPage";
import useFetchProfileData from "../../hooks/useFetchProfileData";
import ContentContainer from "../../components/layout/ContentContainer";
import ContentTitle from "../../components/layout/ContentTitle";
import ContentBody from "../../components/layout/ContentBody";

const UserProfilePage = () => {
  const { intra_id } = useParams();
  const { profileData, statsData, matchHistoryData, error } = useFetchProfileData(intra_id);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert("유효하지 않은 유저 프로필 페이지입니다.");
      navigate(-1);
    }
  }, [error, navigate]);

  if (!profileData || !statsData || !matchHistoryData) return <LoadingPage />;

  return (
    <div className="UserProfilePage">
      <ContentContainer>
        <ContentTitle title="User Profile" />
        <ContentBody>
          <ProfileBox
            isMine={false}
            profileData={profileData}
            statsData={statsData}
            matchHistoryData={matchHistoryData}
          />
        </ContentBody>
      </ContentContainer>
    </div>
  );
};

export default UserProfilePage;
