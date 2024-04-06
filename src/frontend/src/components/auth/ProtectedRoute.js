import React, { useEffect } from "react";
import { Outlet } from "../../lib/rrfs/index.js";
import { useAuth } from "../../context/AuthContext";
import LoadingPage from "../../pages/LoadingPage";

const ProtectedRoute = () => {
  if (process.env.NO_AUTH_PROTECTION === "true") return <Outlet />;

  const { loggedInUser, isLoading, validateTokenInCookies } = useAuth();

  useEffect(() => {
    if (!loggedInUser) validateTokenInCookies();
  }, [loggedInUser]);

  if (isLoading || !loggedInUser) {
    return <LoadingPage />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
