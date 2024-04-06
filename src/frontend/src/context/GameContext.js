import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Outlet } from "../lib/rrfs/index.js";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { del } from "../utils/apiBase";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

const dummySubgameStatus = {
  progress: "playing",
  time_start: 1710723029.423834,
  time_before_start: 0,
  time_left: 19,
  player_a: {
    intra_id: "intra_1",
    nickname: "nick_intra_1",
    avatar: "",
  },
  player_b: {
    intra_id: "yeonhkim",
    nickname: "yeonhkim",
    avatar: "",
  },
  winner: null,
  score_a: 0,
  score_b: 1,
  sudden_death: false,
};

const dummyTournamentConfig = {
  match_point: 3,
  player_a_init_point: 0,
  player_b_init_point: 0,
  time_limit: 30,
  x_max: 400,
  y_max: 300,
  x_min: -400,
  y_min: -300,
  x_init_ball: 0,
  y_init_ball: 0,
  y_init_paddle: 0,
  v_paddle: 300,
  len_paddle: 300,
  u_paddle: 0.1,
  v_ball: 300,
  delay_rank_start: 5,
  delay_subgame_start: 5,
  delay_scoring: 3,
  delay_rank_end: 3,
};

const Game = React.createContext();

// 한 "강" 내의 서브게임 목록에서 자신의 서브게임 인덱스를 찾음
const findFinalSubgameByIntraId = (subgames, intraId) => {
  for (let i = 0; i < subgames.length; i++) {
    for (let j = 0; j < subgames[i].length; j++) {
      const subgame = subgames[i][j];
      if (subgame.player_a?.intra_id === intraId || subgame.player_b?.intra_id === intraId) {
        return { subgame: subgame, rank: i, idx_in_rank: j };
      }
    }
  }
  return null; // 현재 "강" 대진표에 자신이 없는 경우 (=패배)
};

// todo: 참여자가 아닌 유저가 직접 주소창에 방 이름 입력하여 들어가는 케이스 걸러내기
export const GameProvider = ({ children }) => {
  // import
  const navigate = useNavigate();
  const {
    isNamespaceConnected,
    connectNamespace,
    disconnectNamespace,
    setupEventListenersNamespace,
    removeEventListenersNamespace,
    setupEventListenersSocket,
    removeEventListenersSocket,
    emitNamespace,
  } = useSocket();
  const { loggedInUser } = useAuth();

  // todo: 각 객체별 구조를 알 수 있도록 초기값 설정
  // todo: 추후 "대기방" 객체와 "토너먼트" 객체로 데이터 묶기
  // waiting room data
  const [gameData, setGameData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [playersData, setPlayersData] = useState(null);

  // personal data
  const [myPlayerData, setMyPlayerData] = useState({ id: null, host: false });

  // tournament data
  const [tournamentConfig, setTournamentConfig] = useState(null);
  const [bracketData, setBracketData] = useState(null);

  // todo: 추후 subgame context 로 분리
  // subgame data
  const [subgameStatus, setSubgameStatus] = useState({
    progress: "none", // "none", "waiting", "playing", "ended"
    time_start: null,
    time_before_start: 0,
    time_left: 0,
    player_a: null,
    player_b: null,
    winner: "",
    score_a: 0,
    score_b: 0,
  });

  const ballTrajectory = useRef(null);
  const paddleATrajectory = useRef(null);
  const paddleBTrajectory = useRef(null);
  const [ballTrajectoryVersion, setBallTrajectoryVersion] = useState(0);
  const [paddleATrajectoryVersion, setPaddleATrajectoryVersion] = useState(0);
  const [paddleBTrajectoryVersion, setPaddleBTrajectoryVersion] = useState(0);

  // socket namespace
  const [roomNamespace, setRoomNamespace] = useState("");
  const [subgameNamespace, setSubgameNamespace] = useState("");
  const roomNamespaceRef = useRef(roomNamespace);
  const subgameNamespaceRef = useRef(subgameNamespace);

  const getMyFinalSubgameAndRank = (subgames) => {
    return findFinalSubgameByIntraId(subgames, loggedInUser.intra_id);
  };

  // socket events
  const roomDefaultEvents = [
    {
      event: "update_room",
      handler: (data) => {
        if (!data) {
          // 방에 입장해있는 사람이 아닌 경우
          alert("접속이 불가한 방입니다.");
          navigate("/game/list");
        }
        setWaitingRoomData(data);
        console.log("update_room 이벤트 수신: ", data);
      },
    },
    {
      event: "destroyed",
      handler: (data) => {
        console.log("destroyed 이벤트 수신: ", data);
        if (data.destroyed_because === "host_left") alert("방장이 방을 나갔습니다.");
        else if (data.destroyed_because === "host_closed") alert("방장이 방을 닫았습니다.");
        else if (data.destroyed_because === "connection_lost") alert("서버와의 연결이 끊겼습니다.");
        else if (data.destroyed_because === "internal_error") alert("서버 내부 오류로 방이 사라졌습니다.");
        else alert("게임 방이 사라졌습니다.");
        navigate("/game/list");
      },
    },
    {
      event: "update_tournament",
      handler: (data) => {
        console.log("update_tournament 이벤트 수신: ", data);

        const isAllPlayersDecided = (subgames) => {
          // console.log("isAllPlayersDecided 함수 실행");
          subgames.forEach((subgame) => {
            if (!subgame.player_a || !subgame.player_b) {
              // console.log("모든 플레이어가 결정되지 않음");
              return false;
            }
          });
          // console.log("모든 플레이어가 결정됨");
          return true;
        };

        // 대진표 데이터가 아예 없는 상황이거나(맨 처음 서브게임),
        // 다음 "강"으로 넘어갔고, 다음 "강"의 대진표가 완성되어 있다면 subgameStatus 값 업데이트
        // todo: bracketData가 null인 경우에만 실행되는 것 같은데, 이 부분 확인 필요
        if (
          !bracketData ||
          (data.rank_ongoing < bracketData.rank_ongoing && isAllPlayersDecided(data.subgames[data.rank_ongoing]))
        ) {
          const myNewFinalSubgame = getMyFinalSubgameAndRank(data.subgames, loggedInUser.intra_id);
          setSubgameStatus((prevState) => ({
            ...prevState,
            progress: "none",
            time_start: null,
            player_a: myNewFinalSubgame?.subgame.player_a,
            player_b: myNewFinalSubgame?.subgame.player_b,
            winner: myNewFinalSubgame?.subgame.winner,
          }));
        }
        setBracketData(data);
      },
    },
    {
      event: "config",
      handler: (data) => {
        console.log("config 이벤트 수신: ", data);
        setTournamentConfig(data.config);
      },
    },
  ];
  const subgameDefualtEvents = [
    {
      event: "start", // 서브게임 시작
      handler: (data) => {
        emitSubgameSocket("start_ack", {});

        console.log("start 이벤트 수신: ", data);
        const waitingUntilStart = () => {
          const now = new Date().getTime();
          const startTime = new Date(data.t_event * 1000).getTime();
          const delay = startTime - now;

          console.log("startTime: ", startTime);
          console.log("now: ", now);
          console.log("delay: ", delay);

          if (delay > 0) {
            const intervalId = setInterval(() => {
              const currentNow = new Date().getTime();
              const timeLeft = Math.max(startTime - currentNow, 0) / 1000;
              setSubgameStatus((prevState) => ({ ...prevState, time_before_start: Math.ceil(timeLeft) }));
              if (timeLeft <= 0) {
                console.log("서브게임 시뮬레이션까지 대기시간이 끝났습니다.");
                clearInterval(intervalId);
                setSubgameStatus((prevState) => ({ ...prevState, progress: "playing" }));
              }
            }, 1000);
            return () => clearInterval(intervalId);
          } else {
            console.log("delay가 0보다 작습니다.");
            setSubgameStatus((prevState) => ({ ...prevState, progress: "playing" }));
          }
        };

        setSubgameStatus((prevState) => ({ ...prevState, progress: "waiting", time_start: data.t_event }));
        waitingUntilStart();
      },
    },
    {
      event: "ended", // 서브게임 종료
      handler: (data) => {
        emitSubgameSocket("ended_ack", {});

        console.log("ended 이벤트 수신: ", data);
        setSubgameStatus((prevState) => ({ ...prevState, progress: "ended", winner: data.winner }));
        setBallTrajectoryVersion(0);
        setPaddleATrajectoryVersion(0);
        setPaddleBTrajectoryVersion(0);
        disconnectSubgameSocket();
      },
    },
    {
      event: "update_time_left",
      handler: (data) => {
        // console.log("update_time_left 이벤트 수신: ", data);
        setSubgameStatus((prevState) => ({ ...prevState, time_left: data.time_left }));
      },
    },
    {
      event: "update_scores",
      handler: (data) => {
        // console.log("update_scores 이벤트 수신: ", data);
        setSubgameStatus((prevState) => ({ ...prevState, score_a: data.score_a, score_b: data.score_b }));
      },
    },
    {
      event: "update_track_ball",
      handler: (data) => {
        // console.log("update_track_ball 이벤트 수신: ", data);

        const calculateSegmentTimes = (trajectory) => {
          let accumulatedTime = 0;
          const newSegments = trajectory.segments.map((segment) => {
            const length = Math.sqrt(Math.pow(segment.x_e - segment.x_s, 2) + Math.pow(segment.y_e - segment.y_s, 2));
            const duration = length / trajectory.velocity;
            const newSegment = {
              ...segment,
              t_start: accumulatedTime, // 해당 세그먼트의 시작 시간 (맨 처음 세그먼트의 시작 시간은 0)
              duration: duration, // 해당 세그먼트를 통과하는 데 걸리는 시간
            };
            accumulatedTime += duration;
            return newSegment;
          });

          return { ...trajectory, segments: newSegments };
        };

        ballTrajectory.current = calculateSegmentTimes(data);
        setBallTrajectoryVersion((version) => version + 1);
      },
    },
    {
      event: "update_track_paddle",
      handler: (data) => {
        // console.log("update_track_paddle 이벤트 수신: ", data);
        data.t_start = (Date.now() / 1000).toFixed(3);
        if (data.player === "A") {
          paddleATrajectory.current = data;
          setPaddleATrajectoryVersion((version) => version + 1);
        } else if (data.player === "B") {
          paddleBTrajectory.current = data;
          setPaddleBTrajectoryVersion((version) => version + 1);
        }
      },
    },
    {
      event: "time_up",
      handler: (data) => {
        console.log("time_up 이벤트 수신: ", data);
        setSubgameStatus((prevState) => ({ ...prevState, sudden_death: true }));
      },
    },
  ];

  const setWaitingRoomData = async (data) => {
    if (!data) return;
    data.game && setGameData(data.game);
    data.room && setRoomData(data.room);
    data.players && setPlayersData(data.players);
    data.my_player_id && setMyPlayerData((prevState) => ({ ...prevState, id: data.my_player_id }));
    data.am_i_host && setMyPlayerData((prevState) => ({ ...prevState, host: data.am_i_host }));
  };

  const clearWaitingRoom = () => {
    setGameData(null);
    setRoomData(null);
    setPlayersData(null);
    setMyPlayerData({ id: null, host: false });
  };

  const clearTournament = () => {
    setTournamentConfig(null);
    setSubgameStatus((prevState) => ({
      progress: "none",
      time_start: null,
      time_before_start: 0,
      time_left: 0,
      player_a: null,
      player_b: null,
      winner: "",
      score_a: 0,
      score_b: 0,
    }));
  };

  const connectRoomSocket = (newRoomId) => {
    const handleAbortExitRoom = async () => {
      try {
        const resData = await del(API_ENDPOINTS.PLAYERS(myPlayerData.id));
        console.log("플레이어 DELETE 요청 성공", resData);
      } catch (error) {
        console.log("플레이어 DELETE 요청 실패: ", error);
      }
      navigate("/game/list");
    };
    const setupRoomListeners = (newSocket) => {
      setupEventListenersSocket(newSocket, roomDefaultEvents);
    };

    const newRoomNamespace = `/game/room/${newRoomId}`;
    if (isNamespaceConnected(newRoomNamespace)) return;

    connectNamespace(newRoomNamespace, {
      onConnect: (newSocket) => {
        setupRoomListeners(newSocket);
        setRoomNamespace(newRoomNamespace);
        newSocket.emit("entered", {});
        console.log("룸 소켓 세팅 완료");
      },
      onConnectError: () => {
        alert("실시간 통신 연결에 실패하였습니다. (룸 소켓)");
        handleAbortExitRoom();
      },
      onDisconnect: () => {
        clearWaitingRoom();
      },
    });
  };

  const connectNextSubgameSocket = (newBracketData) => {
    const setupSubgameListeners = (newSocket) => {
      setupEventListenersSocket(newSocket, subgameDefualtEvents);
    };

    const rank = bracketData.rank_ongoing;
    const { idx_in_rank } = getMyFinalSubgameAndRank(newBracketData.subgames);
    const newSubgameNamespace = `${roomNamespace}/${rank}/${idx_in_rank}`;
    if (idx_in_rank === -1 || isNamespaceConnected(newSubgameNamespace)) return;

    connectNamespace(newSubgameNamespace, {
      onConnect: (newSocket) => {
        setupSubgameListeners(newSocket);
        setSubgameNamespace(newSubgameNamespace);
        console.log("서브게임 소켓 세팅 완료");
      },
      onConnectError: () => {
        alert("실시간 통신 연결에 실패하였습니다. (서브게임 소켓)");
        handleAbortExit();
      },
      onDisconnect: () => {
        setBracketData(null);
      },
    });
  };

  const disconnectRoomSocket = () => {
    const roomNamespace = roomNamespaceRef.current;
    if (!isNamespaceConnected(roomNamespace)) return;

    const listeningEventList = ["update_room", "destroyed", "update_tournament", "config"];

    emitNamespace(roomNamespace, "exited", { my_player_id: myPlayerData.id });
    removeEventListenersNamespace(roomNamespace, listeningEventList);
    disconnectNamespace(roomNamespace);
  };

  const disconnectSubgameSocket = () => {
    const subgameNamespace = subgameNamespaceRef.current;
    if (!isNamespaceConnected(subgameNamespace)) return;

    const listeningEventList = ["start", "ended", "update_time_left", "update_scores", "update_track_paddle"];

    removeEventListenersNamespace(subgameNamespace, listeningEventList);
    disconnectNamespace(subgameNamespace);
  };

  const setupListenersRoomSocket = (events) => {
    setupEventListenersNamespace(roomNamespace, events);
  };

  const setupListenersSubgameSocket = (events) => {
    setupEventListenersNamespace(subgameNamespace, events);
  };

  const removeListenersRoomSocket = (events) => {
    removeEventListenersNamespace(roomNamespace, events);
  };

  const removeListenersSubgameSocket = (events) => {
    removeEventListenersNamespace(subgameNamespace, events);
  };

  const emitRoomSocket = (event, data) => {
    emitNamespace(roomNamespaceRef.current, event, data);
  };

  const emitSubgameSocket = (event, data) => {
    emitNamespace(subgameNamespaceRef.current, event, data);
  };

  useEffect(() => {
    roomNamespaceRef.current = roomNamespace;
  }, [roomNamespace]);

  useEffect(() => {
    subgameNamespaceRef.current = subgameNamespace;
  }, [subgameNamespace]);

  // 서브게임 시작 전 초기 config 설정
  useEffect(() => {
    if (tournamentConfig && bracketData) {
      console.log(tournamentConfig);
      setSubgameStatus((prevState) => ({
        ...prevState,
        time_left: tournamentConfig?.time_limit,
        score_a: tournamentConfig?.player_a_init_point,
        score_b: tournamentConfig?.player_b_init_point,
      }));
    }
  }, [tournamentConfig, bracketData]);

  // 상태에 의존한 클린업 수행을 위해 useRef 사용
  useEffect(() => {
    return () => {
      console.log("GameContext 언마운드: 게임 관련 소켓 연결 해제 및 값 초기화");
      disconnectRoomSocket();
      disconnectSubgameSocket();
      clearWaitingRoom();
      clearTournament();
      setRoomNamespace("");
      setSubgameNamespace("");
    };
  }, []);

  return (
    <Game.Provider
      value={{
        // data
        gameData,
        roomData,
        playersData,
        myPlayerData,
        bracketData,
        tournamentConfig,
        subgameStatus,
        ballTrajectory,
        paddleATrajectory,
        paddleBTrajectory,
        ballTrajectoryVersion,
        paddleATrajectoryVersion,
        paddleBTrajectoryVersion,
        // function
        getMyFinalSubgameAndRank,
        // socket
        roomNamespace,
        subgameNamespace,
        connectRoomSocket,
        connectNextSubgameSocket,
        disconnectRoomSocket,
        setupListenersRoomSocket,
        setupListenersSubgameSocket,
        removeListenersRoomSocket,
        removeListenersSubgameSocket,
        emitRoomSocket,
        emitSubgameSocket,
      }}>
      {children}
    </Game.Provider>
  );
};

export const useGame = () => useContext(Game);

export const GameProviderWrapper = () => {
  return (
    <GameProvider>
      <Outlet />
    </GameProvider>
  );
};
