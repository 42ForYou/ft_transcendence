import { Action, PopStateEventType } from "../shared/const.js";
import createPath from "./createPath.js";
import parsePath from "./parsePath.js";

/**
 *
 * @description - 36진수로 변환한 랜덤 숫자를 8자리로 자른 문자열을 반환합니다.
 * 해당 함수에서 생성된 문자열을 location객체의 key로 사용합니다.
 *
 * @returns {string}
 */
const createKey = () => {
  return Math.random().toString(36).substr(2, 8);
};

/**
 *
 * @param {Window.Location} location
 *
 * @description - location객체의 state와 key를 반환합니다.
 * @returns {Object}
 */
const getHistoryState = (location) => {
  return {
    usr: location.state,
    key: location.key,
  };
};

/**
 *
 * @param {Object || string} current - 현재 location객체의 pathname, search, hash
 * @param {Ojbect || string} to location객체가 이동해야할 pathname, search, hash
 * @param {Object} state - location객체의 state.
 * @param {string} key - 해당 location의 key값
 *
 * @description - window.location객체를 받아 새로운 location객체를 반환합니다.
 *
 * location객체는 현재 창의 정보를 담고 있습니다.
 * @returns
 */
const createLocation = (current, to, state, key) => {
  const location = {
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: "",
    ...(typeof to === "string" ? parsePath(to) : to),
    state,
    key: to?.key || key || createKey(),
  };
  return location;
};

/**
 *
 * @param {Function} getLocation - window, globalHistory(window.history)를 받아 location을 반환하는 함수
 * @param {Funtion} createHref - to를 받아 href를 반환하는 함수
 * @param {Function || null} validateLocation - location, to를 받는 함수로 loocation이 유효한지 검사합니다.
 * @param {Object} options - window, v5Compat
 * @returns
 */
const getUrlBasedHistory = (getLocation, createHref, validateLocation, options = {}) => {
  const { window = document.defaultView, v5Compat = false } = options;
  const globalHistory = window.history;
  let action = Action.Pop; // 이후 BrowserRouter에서 useState를 통해 re-rendering을 발생시키기 위한 값.
  let listener = null;

  // NOTE: popState 이벤트가 발생하면 실행되는 함수
  // react component를 re-rendering하기 위해 존재합니다.
  // 해당함수는 사용자가 브라우저에서 뒤로가기, 앞으로가기 버튼을 눌렀을 때 실행됩니다.
  const handlePop = () => {
    action = Action.Pop;
    if (listener) {
      listener({ action, location: history.location });
    }
  };

  // NOTE: MDN: window.history.pushState
  // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
  // 위의 함수를 추상화한 push method
  // NOTE: pushState는 페이지를 새로고침하지 않고 url을 갱신하고 페이지 Request를 하지 않습니다.
  // push method는 history stack에 이후의 history를 추가합니다.
  // 이때 이후의 history를 삭제하고 추가합니다.
  // a -> b -> c -> d -> e
  //      👆 현재 페이지
  // push "x"를한다면
  // a -> b -> x
  //           👆 현재 페이지
  const push = (to, state) => {
    action = Action.Push;
    const location = createLocation(history.location, to, state);
    validateLocation?.(location, to);

    const historyState = getHistoryState(location);
    const url = history.createHref(location);

    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      window.location.assign(url);
    }

    if (v5Compat && listener) {
      listener({ action, location });
    }
  };

  // NOTE: MDN: window.history.replaceState
  // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
  // 위의 함수를 추상화한 replace method
  // NOTE: replaceState는 페이지를 새로고침하지 않고 url을 갱신하고 페이지 Request를 하지 않습니다.
  // replace method는 history stack에 이후의 history를 삭제하지 않습니다.
  // a -> b -> c -> d -> e
  //      👆 현재 페이지
  // replace "x"를한다면
  // a -> x -> c -> d -> e
  //      👆 현재 페이지
  const replace = (to, state) => {
    action = Action.Replace;
    const location = createLocation(history.location, to, state);
    validateLocation?.(location, to);

    const historyState = getHistoryState(location);
    const url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);

    if (v5Compat && listener) {
      listener({ action, location });
    }
  };

  // 해당 함수에서 최종적으로 만들고자하는 history 객체입니다.
  const history = {
    get action() {
      return action;
    },

    get location() {
      return getLocation(window, globalHistory);
    },

    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;

      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },

    createHref(to) {
      return createHref(window, to);
    },
    push,

    replace,

    go(n) {
      return globalHistory.go(n);
    },
  };

  return history;
};

/**
 *
 * @param {Object} options
 *  @param {Window} options.window
 *  @param {boolean} options.v5Compat
 * @returns
 */
const createBrowserHistory = (options = {}) => {
  // window.location을 받아 location 객체를 반환하는 함수
  const createBrowserLocation = (window, globalHistory) => {
    const { pathname, search, hash } = window.location;
    return createLocation(
      "",
      { pathname, search, hash },
      globalHistory.state?.usr || null,
      globalHistory.state?.key || "default"
    );
  };

  const createBrowserHref = (_, to) => {
    return typeof to === "string" ? to : createPath(to);
  };

  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
};

export default createBrowserHistory;
