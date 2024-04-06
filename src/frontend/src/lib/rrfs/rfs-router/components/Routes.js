import { DataRouterContext } from "../context";
import { useRoutes } from "../hooks";
import createRoutesFromChildren from "../components/createRoutesFromChildren";
import * as React from "react";

const Routes = ({ children, location }) => {
  const dataRouterContext = React.useContext(DataRouterContext);

  const routes = dataRouterContext && !children ? dataRouterContext.router.routes : createRoutesFromChildren(children);

  return useRoutes(routes, location);
};

export default Routes;
