import parsePath from "../history/parsePath.js";

/**
 *
 * @param {string} search
 *
 * @description - URL의 검색 문자열을 정규화합니다.
 * @example - http://example.com/page?query=term라는 URL에서 검색 문자열은 query=term입니다.
 * 이 함수는 URL의 검색 문자열이 항상 ? 문자로 시작하도록 보장합니다.
 * @returns {string}
 */
const normalizeSearch = (search) => (!search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search);

/**
 *
 * @param {string} hash
 *
 * @description - URL의 해시를 정규화합니다.
 * @example - http://example.com/page#section-1라는 URL에서 해시는 section-1입니다.
 * 이 함수는 URL의 해시가 항상 # 문자로 시작하도록 보장합니다.
 * @returns {string}
 */
const normalizeHash = (hash) => (!hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash);

/**
 *
 * @param {string} relativePath - 변환하려는 상대 경로
 * @param {string} fromPathname - 상대 경로의 기준이 되는 절대 경로.
 *
 * @description - 상대 경로를 절대 경로로 변환합니다.
 * @example - resolvePathname("../test", "/home/user/docs")); // "/home/user/test"
 * @returns
 */
const resolvePathname = (relativePath, fromPathname) => {
  const segments = fromPathname.replace(/\/+$/, "").split("/");
  const relativeSegments = relativePath.split("/");

  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return segments.length > 1 ? segments.join("/") : "/";
};

/**
 *
 * @param {string} to
 * @param {string} fromPathname
 *
 * @description - 이 함수는 주어진 경로에 대해 상대 경로를 절대 경로로 변환하고, 경로의 검색 문자열과 해시를 정규화하는 역할을 합니다.
 * @see resolvePathname
 * @see normalizeSearch
 * @see normalizeHash
 * @returns
 */
const resolvePath = (to, fromPathname = "/") => {
  const { pathname: toPathname, search = "", hash = "" } = typeof to === "string" ? parsePath(to) : to;

  const pathname = toPathname
    ? toPathname.startsWith("/")
      ? toPathname
      : resolvePathname(toPathname, fromPathname)
    : fromPathname;

  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash),
  };
};

/**
 *
 * @param {string || Object} toArg - 이동할 경로
 * @param {string[]} routePathnames - 경로 이름 목록
 * @param {string} locationPathname - 현재 경로
 * @param {boolean} isPathRelative - 상대 경로 여부
 *
 * @description resolveTo는 주어진 경로를 해석하고, 적절한 경로를 반환하는 역할을 합니다.
 * @example
 *
 * const routePathnames = ['/home', '/about', '/contact'];
 * const locationPathname = '/about';
 * // 상대 경로를 사용하는 경우
 * resolveTo('../contact', routePathnames, locationPathname, true); '/contact'
 * // 절대 경로를 사용하는 경우
 * newPath = resolveTo('/contact', routePathnames, locationPathname);  '/contact'
 * @returns {string} path
 */
const resolveTo = (toArg, routePathnames, locationPathname, isPathRelative = false) => {
  const to = typeof toArg === "string" ? parsePath(toArg) : { ...toArg };
  const isEmptyPath = toArg === "" || to.pathname === "";
  const toPathname = isEmptyPath ? "/" : to.pathname;

  let from;

  // 라우팅은 명시적으로 요청된 경우 현재 경로명을 기준으로 합니다.
  //
  // 경로명이 `to`로 명시적으로 제공된 경우, 경로 컨텍스트에 상대적이어야 합니다.
  // 경로 컨텍스트에 상대적이어야 합니다. 이에 대한 설명은 ``링크 대상`` 값에 대한 참고 사항``에 설명되어 있습니다.
  // v5 마이그레이션 가이드의 ``값`에 대한 참고 사항에 설명되어 있습니다.
  //로 시작하는 값과 그렇지 않은 값을 구분하기 위한 수단으로 설명되어 있습니다. 그러나 이는 다음과 같은 경우에 문제가 됩니다.
  // 경로명을 제공하지 않는 // `to` 값의 경우 문제가 됩니다. `to`는 단순히 검색 또는
  // 해시 문자열일 수 있으며, 이 경우 탐색이 현재 위치의 경로에 대한 상대적이라고 가정해야 합니다.
  // 경로 경로명이 아닌 현재 위치의 경로명에 대한 상대적인 것으로 가정해야 합니다.
  if (isPathRelative || toPathname === null || toPathname === undefined) {
    from = locationPathname;
  } else {
    const routePathnameIndex = routePathnames.length - 1;

    if (toPathname.startsWith("..")) {
      const toSegments = toPathname.split("/");

      // Each leading .. segment means "go up one route" instead of "go up one
      // URL segment".  This is a key difference from how <a href> works and a
      // major reason we call this a "to" value instead of a "href".
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }

      to.pathname = toSegments.join("/");
    }

    // 상위 경로보다 ".." 세그먼트가 더 많은 경우, 다음을 기준으로 확인합니다. 루트 / URL을 기준으로 해결합니다.
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }

  const path = resolvePath(to, from);

  // 경로 이름에 원래 "to"가 있는 경우 후행 슬래시가 있는지 확인합니다.
  const hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  // 또는 후행 슬래시가 있는 현재 경로에 대한 링크인 경우
  const hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }

  return path;
};

export default resolveTo;
