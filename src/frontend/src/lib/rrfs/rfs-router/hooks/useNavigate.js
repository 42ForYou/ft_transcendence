import { NavigationContext, RouteContext } from "../context";
import useLocation from "./useLocation";
import * as React from "react";
import { joinPaths, resolveTo, getPathContributingMatches } from "../../router/index.js";

const useNavigate = () => {
  const { basename, navigator } = React.useContext(NavigationContext);
  const { matches } = React.useContext(RouteContext);
  const { pathname: locationPathname } = useLocation();

  const routerPathnamesJson = JSON.stringify(getPathContributingMatches(matches).map((match) => match.pathnameBase));

  const activeRef = React.useRef(false);
  React.useEffect(() => {
    activeRef.current = true;
  });

  const navigate = React.useCallback(
    (to, options = {}) => {
      if (!activeRef.current) return;

      if (typeof to === "number") {
        navigator.go(to);
        return;
      }

      const path = resolveTo(to, JSON.parse(routerPathnamesJson), locationPathname, options.relative === "path");

      if (basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }

      (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
    },
    [basename, navigator, routerPathnamesJson, locationPathname]
  );

  return navigate;
};

export default useNavigate;
