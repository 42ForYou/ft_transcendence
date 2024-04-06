export const API_ENDPOINTS = {
  OAUTH_LOGIN: "/login/",
  LOGOUT: "/logout/",
  OAUTH_TOKEN_EXCHANGE: (code) => `/oauth/?code=${code}`,
  TOKEN_VERIFY: "/token/verify",
  TOKEN_REFRESH: "/token/refresh/",
  TWO_FACTOR_VERIFY: (intra_id, code) => {
    if (intra_id) return `/2fa?intra-id=${intra_id}&code=${code}`;
    return "/2fa/";
  },
  USER_PROFILE: (intra_id) => `/accounts/profiles/${intra_id}/`,
  USER_STATS: (intra_id) => `/accounts/stats/${intra_id}/`,
  USER_HISTORY: (intra_id) => `/accounts/history/${intra_id}/`,
  USER_SEARCH: (page, page_size, keyword) => {
    return `/accounts/search?search=${keyword}&page=${page}&page_size=${page_size}/`;
  },
  ROOM: (roomId) => `/game/game_rooms/${roomId}/`,
  ROOM_LIST: (filter, page, page_size) => {
    if (filter && page && page_size) {
      if (filter === "all") return `/game/game_rooms/?page=${page}&page_size=${page_size}/`;
      else return `/game/game_rooms/?filter=${filter}&page=${page}&page_size=${page_size}/`;
    }
    return "/game/game_rooms/";
  },
  PLAYERS: (player_id) => {
    if (player_id) return `/game/players/${player_id}`;
    return "/game/players/";
  },
  FRIENDS: (filter, page, page_size) => {
    if (filter && page && page_size) {
      if (filter === "all") return `/friends/?page=${page}&page_size=${page_size}/`;
      else return `/friends/?filter=${filter}&page=${page}&page_size=${page_size}/`;
    }
    return "/friends/";
  },
};
