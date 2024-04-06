import { RouteContext } from "../context";
import * as React from "react";

const useParams = () => {
  const { matches } = React.useContext(RouteContext);
  const routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
};

export default useParams;
