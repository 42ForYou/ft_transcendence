import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { Outlet } from "../lib/rrfs/index.js";

const OnlineStatusContext = createContext();

export const OnlineStatusProvider = ({ children }) => {
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const { setupEventListenersNamespace, removeEventListenersNamespace } = useSocket();

  useEffect(() => {
    const handleOnlineStatusUpdate = (data) => {
      const friend = data.friend;
      setOnlineStatuses((prev) => ({
        ...prev,
        [friend.intra_id]: friend.is_online,
      }));
    };

    setupEventListenersNamespace("/online_status", [{ event: "update_friends", handler: handleOnlineStatusUpdate }]);

    return () => {
      removeEventListenersNamespace("/online_status", ["update_friends"]);
    };
  }, [setupEventListenersNamespace, removeEventListenersNamespace]);

  return <OnlineStatusContext.Provider value={onlineStatuses}>{children}</OnlineStatusContext.Provider>;
};

export const useOnlineStatus = () => useContext(OnlineStatusContext);

export const OnlineStatusProviderWrapper = () => {
  return (
    <OnlineStatusProvider>
      <Outlet />
    </OnlineStatusProvider>
  );
};
