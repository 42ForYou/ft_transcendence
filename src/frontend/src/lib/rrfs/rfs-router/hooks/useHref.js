import React from "react";
import { NavigationContext } from "../context.js";
import useResolvedPath from "./useResolvedPath.js";
import { joinPaths } from "../../router/index.js";

const useHref = (to, { relative } = {}) => {
  const { basename, navigator } = React.useContext(NavigationContext);
  const { hash, pathname, search } = useResolvedPath(to, { relative });

  let joinedPathname = pathname;

  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }

  return navigator.createHref({ pathname: joinedPathname, search, hash });
};

export default useHref;
