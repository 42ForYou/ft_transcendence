import { LocationContext } from "../context";
import * as React from "react";

const useLocation = () => {
  return React.useContext(LocationContext).location;
};

export default useLocation;
