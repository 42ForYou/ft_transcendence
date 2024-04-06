/*
예시 객체:
{
	"game": {
		"is_tournament": boolean,
		"time_limit": int,
		"game_point": int,
		"n_players": int,
	},
	"room": {
		"title": "string"
	}
}
*/

// 객체에 해당하는 key들이 전부 있는지 확인
export const hasKeys = (obj, keys) => {
  return keys.every((keyPath) => {
    let current = obj;
    const keyParts = keyPath.split(".");
    for (const part of keyParts) {
      if (current[part] === undefined) {
        return false;
      }
      current = current[part];
    }
    return true;
  });
};
// ex) hasKeys(obj, ["game.n_players", "room.title"]);

// path에 해당하는 value의 값을 업데이트하여 반환
export const updateProperty = (orig, path, value) => {
  const updated = JSON.parse(JSON.stringify(orig)); // 깊은 복사
  const keys = path.split("."); // '.' 기준으로 split하여 key의 배열을 얻음
  let current = updated;
  // split해 얻은 key들로 끝에서 하나 이전까지 타고 감 (객체가 없을 시 빈 객체 생성)
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  // 찾은 위치에 값을 할당
  current[keys[keys.length - 1]] = value;
  return updated;
};
// ex) updateProperty(roomData, "room.title", new_room_title);
