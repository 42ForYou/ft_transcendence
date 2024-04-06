/**
 *
 * @param {string} pathname
 * @param {string} basename
 *
 * @description - 이 함수는 두 개의 문자열 인자를 받아서,
 * 첫 번째 문자열(pathname)에서 두 번째 문자열(basename)을 제거하는 역할을 합니다.
 * @returns
 */
const stripBasename = (pathname, basename) => {
  if (basename === "/") return pathname;

  // pathname이 basename으로 시작하지 않는 경우, 자를 수 없기 때문에 null을 반환합니다.
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  // 사용자가 basename을 슬래시(/)로 끝나게 지정한 경우, 그것을 지원하기 위해 슬래시를 남겨둡니다.
  const startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  const nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname이 basename/로 시작하지 않는 경우
    return null;
  }

  return pathname.slice(startIndex) || "/";
};

export default stripBasename;
