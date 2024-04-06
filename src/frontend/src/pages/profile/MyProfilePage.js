import React from "react";
import ProfileBox from "../../components/profile/ProfileBox";
import { useAuth } from "../../context/AuthContext";
import useFetchProfileData from "../../hooks/useFetchProfileData";
import ContentContainer from "../../components/layout/ContentContainer";
import ContentTitle from "../../components/layout/ContentTitle";
import ContentBody from "../../components/layout/ContentBody";
import LoadingPage from "../LoadingPage";

// todo: 더미 데이터 삭제
const dummyHistoryData = [
  {
    game: {
      game_id: 1,
      is_tournament: true,
      game_point: 100,
      time_limit: 30.0,
      n_players: 8,
    },
    game_player: {
      id: 101,
      avatar: "avatar1.png",
      game: 1,
      nickname: "Player1",
      rank: 1,
    },
    subgames: [
      {
        id: 201,
        rank: 2,
        idx_in_rank: 1,
        point_a: 30,
        point_b: 20,
        winner: "A",
        t_start: 1610000000.0,
        t_end: 1610000030.0,
        game: 1,
        player_a: 101,
        player_b: 102,
        game_player_won: true,
      },
      {
        id: 202,
        rank: 1,
        idx_in_rank: 1,
        point_a: 20,
        point_b: 30,
        winner: "B",
        t_start: 1610000100.0,
        t_end: 1610000130.0,
        game: 1,
        player_a: 101,
        player_b: 103,
        game_player_won: false,
      },
    ],
  },
  {
    game: {
      game_id: 2,
      is_tournament: false,
      game_point: 50,
      time_limit: 15.0,
      n_players: 2,
    },
    game_player: {
      id: 102,
      avatar: "avatar2.png",
      game: 2,
      nickname: "Player2",
      rank: 0,
    },
    subgames: [
      {
        id: 203,
        rank: 0,
        idx_in_rank: 0,
        point_a: 10,
        point_b: 20,
        winner: "B",
        t_start: 1610000200.0,
        t_end: 1610000215.0,
        game: 2,
        player_a: 102,
        player_b: 104,
        game_player_won: false,
      },
    ],
  },
  {
    game: {
      game_id: 3,
      is_tournament: false,
      game_point: 40,
      time_limit: 10.0,
      n_players: 2,
    },
    game_player: {
      id: 103,
      avatar: "avatar3.png",
      game: 3,
      nickname: "Player3",
      rank: 0,
    },
    subgames: [
      {
        id: 204,
        rank: 0,
        idx_in_rank: 0,
        point_a: 15,
        point_b: 25,
        winner: "B",
        t_start: 1610000300.0,
        t_end: 1610000310.0,
        game: 3,
        player_a: 103,
        player_b: 105,
        game_player_won: false,
      },
    ],
  },
  {
    game: {
      game_id: 4,
      is_tournament: false,
      game_point: 60,
      time_limit: 20.0,
      n_players: 2,
    },
    game_player: {
      id: 104,
      avatar: "avatar4.png",
      game: 4,
      nickname: "Player4",
      rank: 0,
    },
    subgames: [
      {
        id: 205,
        rank: 0,
        idx_in_rank: 0,
        point_a: 30,
        point_b: 10,
        winner: "A",
        t_start: 1610000400.0,
        t_end: 1610000420.0,
        game: 4,
        player_a: 104,
        player_b: 106,
        game_player_won: true,
      },
    ],
  },
  {
    game: {
      game_id: 5,
      is_tournament: true,
      game_point: 150,
      time_limit: 45.0,
      n_players: 16,
    },
    game_player: {
      id: 105,
      avatar: "avatar5.png",
      game: 5,
      nickname: "Player5",
      rank: -1,
    },
    subgames: [
      {
        id: 206,
        rank: 0,
        idx_in_rank: 1,
        point_a: 50,
        point_b: 30,
        winner: "A",
        t_start: 1610000500.0,
        t_end: 1610000545.0,
        game: 5,
        player_a: 105,
        player_b: 107,
        game_player_won: true,
      },
      {
        id: 207,
        rank: 1,
        idx_in_rank: 1,
        point_a: 40,
        point_b: 20,
        winner: "A",
        t_start: 1610000600.0,
        t_end: 1610000645.0,
        game: 5,
        player_a: 105,
        player_b: 108,
        game_player_won: true,
      },
    ],
  },
];

const dummyStatsData = {
  n_dual_match: 42,
  n_dual_wins: 30,
  n_dual_looses: 12,
  n_tournaments: 21,
  tournament_stats: [
    {
      n_ranks: 2,
      n_plays: 14,
      stats: [
        { final_rank: -1, n_tournaments: 2 },
        { final_rank: 0, n_tournaments: 4 },
        { final_rank: 1, n_tournaments: 8 },
      ],
    },
  ],
};

const MyProfilePage = () => {
  const { loggedInUser } = useAuth();
  const { profileData, statsData, matchHistoryData } = useFetchProfileData(loggedInUser?.intra_id);

  if (!profileData || !statsData || !matchHistoryData) return <LoadingPage />;

  return (
    <div className="MyProfilePage">
      <ContentContainer>
        <ContentTitle title="My Profile" />
        <ContentBody>
          <ProfileBox
            isMine={true}
            profileData={profileData}
            statsData={statsData}
            matchHistoryData={matchHistoryData}
          />
        </ContentBody>
      </ContentContainer>
    </div>
  );
};

export default MyProfilePage;
