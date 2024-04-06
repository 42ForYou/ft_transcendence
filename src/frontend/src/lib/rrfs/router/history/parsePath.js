/**
 *
 * @param {string} path
 * @returns {Object}
 *  @param {string} hash
 *  @param {string} search
 *  @param {string} pathname
 */
const parsePath = (path) => {
  const parsedPath = {};

  if (path) {
    const hashIndex = path.indexOf("#");
    // #가 있다면 hash 가 존재한다는 뜻이기 때문에 parsedPath.hash에 할당하고 path에서 제거합니다.
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    const searchIndex = path.indexOf("?");
    // ?가 있다면 쿼리가 존재한다는 뜻이기 때문에 parsedPath.search에 할당하고 path에서 제거합니다.
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    // 남아있는 문자열이 있는 경우 pathname으로 할당합니다.
    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
};

export default parsePath;
