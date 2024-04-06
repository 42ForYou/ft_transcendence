import stripBasename from "./stripBasename.js";
import parsePath from "../history/parsePath.js";
import joinPaths from "./joinPaths.js";

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === "*";

/**
 *
 * @param {string} path
 * @param {boolean || undefined} index
 *
 * @description - 경로와 인덱스를 인자로 받아 경로의 점수를 계산하는 역할을 합니다.
 * 세그먼트 중 하나라도 스플랫(*)이라면, 초기 점수에 스플랫 패널티를 추가합니다.
 * 스플랫은 경로의 일부분을 동적으로 매칭하는 데 사용되는 특수 문자입니다.
 * @returns {number}
 */
const computeScore = (path, index) => {
  const segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments
    .filter((s) => !isSplat(s))
    .reduce(
      (score, segment) =>
        score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
      initialScore
    );
};

/**
 *
 * @param {Route[]} routes - 경로 객체의 배열입니다. 각 경로 객체는 경로 정보를 포함하고 있습니다.
 * @param {Object[]} branches - 경로 브랜치 객체의 배열입니다.
 * @param {Object} parentsMeta - 부모 메타 정보 객체입니다.
 * @param {string} parentPath - 부모 경로입니다.
 *
 * @description - 주어진 라우트 배열을 "평탄화"하는 역할을 합니다.
 * @returns
 */
const flattenRoutes = (routes, branches = [], parentsMeta = [], parentPath = "") => {
  routes.forEach((route, index) => {
    const meta = {
      relativePath: route.path || "",
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route,
    };

    if (meta.relativePath.startsWith("/")) {
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }

    const path = joinPaths([parentPath, meta.relativePath]);
    const routesMeta = parentsMeta.concat(meta);

    // 배열에 이 경로를 추가하기 전에 자식 경로를 추가하여 경로 트리를 깊이 우선으로 탐색하고
    // 자식 경로가 "평평한" 버전에서 부모 경로보다 먼저 나타나도록 합니다.
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, path);
    }

    // 경로가 없는 경로는 인덱스 경로가 아닌 이상 그 자체로는 일치하지 않아야 하므로 가능한 분기 목록에 추가하지 마세요.
    if ((route.path === null || route.path === undefined) && !route.index) {
      return;
    }

    branches.push({ path, score: computeScore(path, route.index), routesMeta });
  });

  return branches;
};

/**
 *
 * @param {number[]} a
 * @param {number[]} b
 *
 * @description - 두 개의 숫자 배열을 인자로 받아 경로의 순서를 비교하는 역할을 합니다.
 * @returns
 */
const compareIndexes = (a, b) => {
  const siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);

  return siblings
    ? // 만약 두 경로가 형제 관계라면, 함수는 두 배열의 마지막 요소의 차이를 반환합니다.
      // 이는 형제 경로 중에서 인덱스가 낮은 경로가 먼저 오게 됩니다.
      //이렇게 하면 사용자는 동일한 경로를 가진 라우트의 순서를 조정함으로써 매칭 동작을 세밀하게 제어할 수 있습니다.
      a[a.length - 1] - b[b.length - 1]
    : // 만약 두 경로가 형제 관계가 아니라면, 함수는 0을 반환합니다.
      // 이는 두 경로의 순서가 서로에게 영향을 미치지 않는다는 것을 의미합니다.
      // 즉, 형제 관계가 아닌 경로들은 인덱스로 순서를 정하는 것이 의미가 없습니다.
      0;
};

/**
 *
 * @param {Object} branches - route branch object
 *
 * @description - 웹 어플리케이션의 라우팅 시스템에서 경로를 정렬하는 역할을 합니다.
 */
const rankRouteBranches = (branches) => {
  branches.sort((a, b) =>
    a.score !== b.score
      ? b.score - a.score // Higher score first
      : compareIndexes(
          a.routesMeta.map((meta) => meta.childrenIndex),
          b.routesMeta.map((meta) => meta.childrenIndex)
        )
  );
};

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/docs/en/v6/utils/match-path
 */
const matchPath = (pattern, pathname) => {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }

  const [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);

  const match = pathname.match(matcher);
  if (!match) return null;

  const matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  const captureGroups = match.slice(1);
  const params = paramNames.reduce((memo, paramName, index) => {
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      const splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }

    memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName);
    return memo;
  }, {});

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
  };
};

const compilePath = (path, caseSensitive = false, end = true) => {
  const paramNames = [];
  let regexpSource =
    "^" +
    path
      .replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
      .replace(/^\/*/, "/") // Make sure it has a leading /
      .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
      .replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^\\/]+)";
      });

  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource +=
      path === "*" || path === "/*"
        ? "(.*)$" // Already matched the initial /, just match the rest
        : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else {
    regexpSource += end
      ? "\\/*$" // When matching to the end, ignore trailing slashes
      : // Otherwise, match a word boundary or a proceeding /. The word boundary restricts
        // parent routes to matching only their own words and nothing more, e.g. parent
        // route "/home" should not match "/home2".
        // Additionally, allow paths starting with `.`, `-`, `~`, and url-encoded entities,
        // but do not consume the character in the matched path so they can match against
        // nested paths.
        "(?:(?=[@.~-]|%[0-9A-F]{2})|\\b|\\/|$)";
  }

  const matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");

  return [matcher, paramNames];
};

/**
 *
 * @param {string} value
 * @param {string} paramName
 *
 * @description - URL 파라미터를 안전하게 디코딩하는 역할을 합니다.
 * @returns {string}
 */
const safelyDecodeURIComponent = (value, paramName) => {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    warning(
      false,
      `The value for the URL param "${paramName}" will not be decoded because` +
        ` the string "${value}" is a malformed URL segment. This is probably` +
        ` due to a bad percent encoding (${error}).`
    );

    return value;
  }
};

/**
 *
 * @param {string} pathname
 *
 * @description - 주어진 경로를 정규화하는 역할을 합니다.
 * @returns {string}
 */
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");

/**
 *
 * @param {Object} branch - 경로 브랜치
 * @param {string} pathname - 경로 이름
 *
 * @description - 이 코드는 주어진 경로와 라우트 브랜치를 매칭하는 역할을 합니다.
 * @returns
 */
const matchRouteBranch = (branch, pathname) => {
  const { routesMeta } = branch;

  const matchedParams = {};
  let matchedPathname = "/";
  const matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    const meta = routesMeta[i];
    const end = i === routesMeta.length - 1;
    const remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    const match = matchPath({ path: meta.relativePath, caseSensitive: meta.caseSensitive, end }, remainingPathname);

    if (!match) return null;

    Object.assign(matchedParams, match.params);

    const route = meta.route;

    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route,
    });

    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }

  return matches;
};

/**
 *
 * @param {Object[]} routes - 경로객체의 배열입니다. 각 경로 객체는 경로 정보를 포함하고 있습니다.
 * @param {Obejct || string} locationArg - 위치 정보. 문자열 또는 객체로 전달됩니다.
 * @param {string} basename 기본 경로입니다.
 *
 * @description - 주어진 경로와 위치를 일치시키고 일치 데이터를 반환합니다.
 * @returns
 */
const matchRoutes = (routes, locationArg, basename = "/") => {
  const location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;

  const pathname = stripBasename(location.pathname || "/", basename);

  if (pathname === null || pathname === undefined) {
    return null;
  }

  const branches = flattenRoutes(routes);
  rankRouteBranches(branches);

  let matches = null;
  for (let i = 0; (matches === null || matches === undefined) && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], pathname);
  }

  return matches;
};

export default matchRoutes;
