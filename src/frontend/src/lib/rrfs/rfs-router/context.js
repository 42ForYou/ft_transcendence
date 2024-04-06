import * as React from "react";

const LocationContext = React.createContext(null);

const NavigationContext = React.createContext(null);

const DataRouterContext = React.createContext(null);

const DataRouterStateContext = React.createContext(null);

const DataStaticRouterContext = React.createContext(null);

const RouteContext = React.createContext({
  outlet: null,
  matches: [],
});

const RouteErrorContext = React.createContext(null);

export {
  LocationContext,
  NavigationContext,
  DataRouterContext,
  DataRouterStateContext,
  DataStaticRouterContext,
  RouteContext,
  RouteErrorContext,
};
