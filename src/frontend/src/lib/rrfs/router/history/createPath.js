/**
 *
 * @param {Object} param0
 *   @param {string} pathname
 *   @param {string} search
 *   @param {string} hash
 *
 * @description - pathname, search, hash를 조합하여 path를 반환합니다.
 * @returns {string}
 */
const createPath = ({ pathname = "/", search = "", hash = "" }) => {
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
};

export default createPath;
