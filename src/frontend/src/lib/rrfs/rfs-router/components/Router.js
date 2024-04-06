import { parsePath, stripBasename, Action as NavigationType } from "../../router/index.js";
import { LocationContext, NavigationContext } from "../context";
import * as React from "react";

const Router = ({
  basename: basenameProp = "/",
  children = null,
  location: locationProp,
  navigationType = NavigationType.Pop,
  navigator,
  state: staticProp = false,
}) => {
  const basename = basenameProp.replace(/^\/*/, "/");
  const navigationContext = React.useMemo(
    () => ({ basename, navigator, static: staticProp }),
    [basename, navigator, staticProp]
  );

  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }

  const { pathname = "/", search = "", hash = "", state = null, key = "default" } = locationProp;

  const location = React.useMemo(() => {
    const trailingPathname = stripBasename(pathname, basename);

    if (trailingPathname === null || trailingPathname === undefined) {
      return null;
    }

    return {
      pathname: trailingPathname,
      search,
      hash,
      state,
      key,
    };
  }, [basename, pathname, search, hash, state, key]);

  if (location === null || location === undefined) {
    return null;
  }

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider children={children} value={{ location, navigationType }} />
    </NavigationContext.Provider>
  );
};

export default Router;
