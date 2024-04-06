import React from "react";
import SubgameBracketModal from "../components/game/SubgameBracketModal";
import SubgameResultModal from "../components/game/SubgameResultModal";
import TournamentResultModal from "../components/game/TournamentResultModal";
import MyProfilePage from "./profile/MyProfilePage";
import WaitingRoomBox from "../components/waiting_room/WaitingRoomBox";
import BracketPage from "./game/BracketPage";
import Bracket from "../components/game/Bracket";
import PongScene from "../components/game/PongScene";
import PongScenePage from "./game/PongScenePage";

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

const dummyProfileData = {
  avatar: "",
  email: "yeonhkim@student.42seoul.kr",
  intra_id: "yeonhkim",
  nickname: "yeonhkim",
  two_factor_auth: false,
};

const subgame = {
  // 4강전 2경기
  player_a: {
    intra_id: "yeonhkim3",
    nickname: "yeonhkim",
    avatar: "./pengdori.jpg",
  },
  player_b: {
    intra_id: "yeonhkim4",
    nickname: "baboyona",
    avatar: "./pengdori.jpg",
  },
  // winner: null, // 경기가 끝나면 정해짐
  winner: "A", // 경기가 끝나면 정해짐
};

const middleDualBracketData = {
  n_ranks: 1,
  rank_ongoing: 1,
  subgames: [
    [
      {
        // 4강전 1경기
        player_a: {
          intra_id: "플레이어 1",
          nickname: "yeonhkimbabo",
          avatar: "./pengdori.jpg",
        },
        player_b: {
          intra_id: "플레이어 2",
          nickname: "baboyeonhkim",
          avatar: "./pengdori.jpg",
        },
        winner: "A", // 경기가 끝나면 정해짐
      },
    ],
  ],
};

const middleTournamentBracketData = {
  n_ranks: 2,
  rank_ongoing: 1,
  subgames: [
    [
      {
        // 4강전 1경기
        player_a: {
          intra_id: "플레이어 1",
          nickname: "yeonhkimbabo",
          avatar: "./pengdori.jpg",
        },
        player_b: {
          intra_id: "플레이어 2",
          nickname: "baboyeonhkim",
          avatar: "./pengdori.jpg",
        },
        winner: "A", // 경기가 끝나면 정해짐
      },
    ],
    [
      {
        // 4강전 1경기
        player_a: {
          intra_id: "yeonhkim",
          nickname: "yeonhkimbabo",
          avatar: "./pengdori.jpg",
        },
        player_b: {
          intra_id: "yeonhkim2",
          nickname: "baboyeonhkim",
          avatar: "./pengdori.jpg",
        },
        winner: null, // 경기가 끝나면 정해짐
      },
      {
        // 4강전 2경기
        player_a: {
          intra_id: "yeonhkim3",
          nickname: "kimyeonhababo",
          avatar: "./pengdori.jpg",
        },
        player_b: {
          intra_id: "yeonhkim4",
          nickname: "baboyona",
          avatar: "./pengdori.jpg",
        },
        winner: null, // 경기가 끝나면 정해짐
      },
    ],
  ],
};

const winTournamentBracketData = {
  n_ranks: 2,
  rank_ongoing: -1,
  subgames: [
    [
      {
        player_a: {
          intra_id: "yeonhkim",
          nickname: "yeonhkimdd",
          avatar: "./pengdori.jpg",
        },
        player_b: {
          intra_id: "플레이어 2",
          nickname: "baboyeonhkim",
          avatar: "./pengdori.jpg",
        },
        winner: "A", // 경기가 끝나면 정해짐
      },
    ],
    [
      {
        // 4강전 1경기
        player_a: {
          intra_id: "플레이어 1",
          nickname: "yeonhkimbabo",
          avatar: "./pengdori.jpg",
        },
        player_b: {
          intra_id: "yeonhkim2",
          nickname: "baboyeonhkim",
          avatar: "./pengdori.jpg",
        },
        winner: null, // 경기가 끝나면 정해짐
      },
      {
        // 4강전 2경기
        player_a: {
          intra_id: "yeonhkim3",
          nickname: "kimyeonhababo",
          avatar: "./pengdori.jpg",
        },
        player_b: {
          intra_id: "yeonhkim4",
          nickname: "baboyona",
          avatar: "./pengdori.jpg",
        },
        winner: null, // 경기가 끝나면 정해짐
      },
    ],
  ],
};

const dummyTournamentGameData = {
  game_id: 1,
  game_point: 100,
  is_tournament: true,
  n_players: 4,
  time_limit: 30,
};

const dummyTournamentRoomData = {
  room_id: 1,
  game: 1,
  is_tournament: true,
  n_players: 4,
  room_name: "Tournament Room",
};

const dummyTournamentPlayersData = [
  {
    avatar: "avatar1.png",
    game: 1,
    id: 101,
    nickname: "Player1",
    rank: 1,
  },
  {
    avatar: "avatar2.png",
    game: 1,
    id: 102,
    nickname: "Player2",
    rank: 2,
  },
  {
    avatar: "avatar3.png",
    game: 1,
    id: 103,
    nickname: "Player3",
    rank: 3,
  },
  {
    avatar: "avatar4.png",
    game: 1,
    id: 104,
    nickname: "Player4",
    rank: 4,
  },
];

const dummyHostMyPlayerData = {
  id: 1,
  host: true,
};

const dummyNotHostMyPlayerData = {
  id: 1,
  host: false,
};

const dummyDualGameData = {
  game_id: 2,
  game_point: 50,
  is_tournament: false,
  n_players: 2,
  time_limit: 15,
};

const dummyDualRoomData = {
  room_id: 2,
  game: 2,
  is_tournament: false,
  n_players: 2,
  join_players: 1,
  title: "Dual Room",
  host: "Player1",
};

const dummyDualPlayersData = [
  {
    avatar: "avatar2.png",
    game: 2,
    id: 102,
    nickname: "yeonhkim",
    rank: 1,
  },
  // {
  //   avatar: "avatar4.png",
  //   game: 2,
  //   id: 104,
  //   nickname: "Player4",
  //   rank: 2,
  // },
];

const TestPage = () => {
  return (
    <>
      <PongScenePage />
      {/* <h1>TestPage</h1> */}
      {/* <TournamentResultModal bracketData={middleTournamentBracketData} /> */}
      {/* <TournamentResultModal bracketData={winTournamentBracketData} /> */}
      {/* <SubgameBracketModal playerA={subgame.player_a} playerB={subgame.player_b} remainingTime={42} /> */}
      {/* <SubgameResultModal playerA={subgame.player_a} playerB={subgame.player_b} winner={subgame.winner} /> */}
      {
        // <div className="GameWaitingRoomPage">
        //     <WaitingRoomBox
        //       gameData={dummyTournamentGameData}
        //       roomData={dummyTournamentRoomData}
        //       playersData={dummyTournamentPlayersData}
        //       myPlayerData={dummyHostMyPlayerData}
        //     />
        // </div>
      }
      {/* {
        <div className="GameWaitingRoomPage">
          <WaitingRoomBox
            gameData={dummyDualGameData}
            roomData={dummyDualRoomData}
            playersData={dummyDualPlayersData}
            myPlayerData={dummyHostMyPlayerData}
            // myPlayerData={dummyNotHostMyPlayerData}
          />
        </div>
      } */}
      <></>
      {/* <div className="BracketPage">
        <div className="d-flex-col justify-content-between p-5 flex-grow-1">
          <h1 className="text-start m-0">Bracket</h1>
          <Bracket nRanks={middleDualBracketData.n_ranks} subgames={middleDualBracketData.subgames} />
          <Bracket nRanks={middleTournamentBracketData.n_ranks} subgames={middleTournamentBracketData.subgames} />
        </div>
      </div> */}
    </>
  );
};

export default TestPage;
