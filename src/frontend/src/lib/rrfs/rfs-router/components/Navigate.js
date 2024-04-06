import { DataRouterContext } from "../context";
import useNavigate from "../hooks/useNavigate";
import * as React from "react";

const Navigate = ({ to, replace, state, relative }) => {
  const dataRouterState = React.useContext(DataRouterContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (dataRouterState && dataRouterState.navigate.state !== "idle") {
      return;
    }
    navigate(to, { replace, state, relative });
  });

  return null;
};

export default Navigate;
