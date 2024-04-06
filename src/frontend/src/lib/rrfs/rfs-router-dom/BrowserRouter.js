import { createBrowserHistory } from "../router/index.js";
import Router from "../rfs-router/components/Router";
import * as React from "react";

/**
 *
 * @param {*} param0
 *  @param {string} basename
 *  @param {RfsNode} children
 *  @param {Window} window
 *
 * @description - A `<Router>` for use in web browsers.
 * web browser를 위한 Router입니다. 기본적으로 react-router의 Router를 쓰고 있고
 * 추가적으로 browser의 history와 location을 @createBrowserHistory 를 통해 관리합니다.
 * 해당 함수에서 history의 동작과 loation의 동작을 추상화 하여 관리합니다.
 * @see react-router/history.ts
 * @returns
 */
const BrowserRouter = ({ basename, children, window }) => {
  const historyRef = React.useRef();

  if (historyRef.current === null || historyRef.current === undefined) {
    // NOTE: A browser history object keeps track of the browsing history of an application using the browser's built-in history stack.
    // It is designed to run in modern web browsers
    // that support the HTML5 history interface including pushState, replaceState, and the popstate event.
    historyRef.current = createBrowserHistory({ window, v5Compat: true });
  }

  const history = historyRef.current;

  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      action={state.action}
      location={state.location}
      navigator={history}
    />
  );
};

export default BrowserRouter;
