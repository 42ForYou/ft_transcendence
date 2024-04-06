import { joinPaths, matchRoutes, parsePath, Action as NavigationType } from "../../router/index.js";
import useLocation from "./useLocation";
import { DataRouterStateContext, DataStaticRouterContext, RouteContext, RouteErrorContext } from "../context";
import * as React from "react";

// NOTE: Class Component를 구현하지 않았기 때문에 Error Boundary를 사용할 수 없습니다.
// 때문에 현재 우리 프론트엔드 코드에서 Error Boundary를 사용하려면 다음과 같이 함수형 컴포넌트를 사용해야 합니다.
// 참고: https://reactjs.org/docs/error-boundaries.html
const RenderErrorBoundary = ({ location, error, component, children }) => {
  const [state, setState] = React.useState({ location, error });

  // Mimic getDerivedStateFromProps
  React.useEffect(() => {
    setState((prevState) => {
      if (prevState.location !== location) {
        return { error, location };
      }
      return { ...prevState, error: error || prevState.error };
    });
  }, [location, error]);

  // This would be the place to log errors or handle side effects on error, but
  // remember, functional components cannot catch child component errors by themselves.

  // The actual error boundary logic would still need to be in a class component
  // or using a third-party library that provides a functional approach.

  return state.error ? <RouteErrorContext.Provider value={state.error} children={component} /> : children;
};

const RenderedRoute = ({ match, routeContext, children }) => {
  const dataStaticRouterContext = React.useContext(DataStaticRouterContext);

  if (dataStaticRouterContext && match.route.errorElement) {
    dataStaticRouterContext._deepestRenderedBoundaryId = match.route.id;
  }

  return <RouteContext.Provider value={routeContext}>{children}</RouteContext.Provider>;
};

const _renderMatches = (matches, parentMatches, dataRouterState) => {
  if (matches === null || matches === undefined) {
    if (dataRouterState?.errors) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }

  let renderedMathches = matches;

  const errors = dataRouterState?.errors;
  if (errors !== null && errors !== undefined) {
    const errorIndex = renderedMathches.findIndex((match) => match.route.id && errors?.[match.route.id]);
    renderedMathches = renderedMathches.slice(0, Math.min(renderedMathches.length, errorIndex + 1));
  }

  return renderedMathches.reduceRight((outlet, match, index) => {
    const error = match.route.id ? errors?.[match.route.id] : null;

    const errorElement = dataRouterState ? match.route.errorElement : null;

    const getChildren = () => (
      <RenderedRoute
        match={match}
        routeContext={{
          outlet,
          matches: parentMatches.concat(renderedMathches.slice(0, index + 1)),
        }}>
        {error ? errorElement : match.route.element !== undefined ? match.route.element : outlet}
      </RenderedRoute>
    );

    return dataRouterState && (match.route.errorElement || index === 0) ? (
      <RenderErrorBoundary
        location={dataRouterState.location}
        component={errorElement}
        error={error}
        children={getChildren()}
      />
    ) : (
      getChildren()
    );
  }, null);
};

const useRoutes = (routes, locationArg) => {
  const dataRouterStateContext = React.useContext(DataRouterStateContext);
  const { matches: parentMatches } = React.useContext(RouteContext);
  const routeMatch = parentMatches[parentMatches.length - 1];
  const parentParams = routeMatch ? routeMatch.params : {};
  const parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  // FOR DEBUG
  // const parentPathname = routeMatch ? routeMatch.pathname : "/";
  // const parentRoute = routeMatch && routeMatch.route;

  const locationFromContext = useLocation();

  let location;
  if (locationArg) {
    const parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }

  const pathname = location.pathname || "/";
  const remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/";

  const matches = matchRoutes(routes, { pathname: remainingPathname });

  const renderedMathches = _renderMatches(
    matches &&
      matches.map((match) =>
        Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase:
            match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase, match.pathnameBase]),
        })
      ),
    parentMatches,
    dataRouterStateContext || undefined
  );

  if (locationArg) {
    return (
      <locationFromContext.Provider
        value={{
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default",
            ...location,
          },
          navigationType: NavigationType.Pop,
        }}>
        {renderedMathches}
      </locationFromContext.Provider>
    );
  }

  return renderedMathches;
};

export default useRoutes;
