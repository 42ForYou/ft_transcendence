import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Outlet } from "../lib/rrfs/index.js";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [sockets, setSockets] = useState({});
  const socketsRef = useRef({});

  const connectNamespace = (namespace, lifecycleHandlers) => {
    const { onConnect, onConnectError, onDisconnect } = lifecycleHandlers || {};

    if (!socketsRef.current[namespace]) {
      const newSocket = io(`${process.env.SOCKET_BASE_URL}${namespace}`, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
      });

      newSocket.on("connect", () => {
        console.log(`Socket[${namespace}] connected: `, newSocket.id);
        if (onConnect) onConnect(newSocket);
      });

      newSocket.on("connect_error", (err) => {
        console.error(`Socket[${namespace}] connection error: `, err);
        if (onConnectError) onConnectError(err);
      });

      newSocket.on("disconnect", (reason) => {
        console.log(`Socket[${namespace}] disconnected: `, reason);
        if (onDisconnect) onDisconnect(reason);
      });

      newSocket.emitWithTime = (event, data) => {
        const timestamp = (Date.now() / 1000).toFixed(3);
        const dataWithTimestamp = { ...data, t_event: timestamp };
        newSocket.emit(event, dataWithTimestamp);
      };

      setSockets((prevSockets) => {
        const updatedSockets = { ...prevSockets, [namespace]: newSocket };
        socketsRef.current = updatedSockets;
        return updatedSockets;
      });
    }
  };

  const disconnectNamespace = (namespace) => {
    setSockets((currentSockets) => {
      const socket = currentSockets[namespace];
      if (socket) {
        socket.disconnect();
        const updatedSockets = { ...currentSockets };
        delete updatedSockets[namespace];
        socketsRef.current = updatedSockets;
        return updatedSockets;
      }
      return currentSockets;
    });
  };

  const setupEventListenersSocket = (socket, events) => {
    if (socket) {
      events.forEach(({ event, handler }) => {
        socket.on(event, handler);
      });
    }
  };

  const removeEventListenersSocket = (socket, events) => {
    if (socket) {
      events.forEach(({ event, handler }) => {
        if (handler) {
          socket.off(event, handler);
        } else {
          socket.off(event);
        }
      });
    }
  };

  // 네임스페이스와 event 객체 배열을 받아서 해당 소켓에 이벤트 리스너를 등록
  // 하나의 이벤트 객체 구조는 { event: string, handler: function } 형태
  const setupEventListenersNamespace = (namespace, events) => {
    const socket = sockets[namespace];
    if (socket) {
      events.forEach(({ event, handler }) => {
        socket.on(event, handler);
      });
    }
  };

  // 이벤트 명만 넘기면 됨
  const removeEventListenersNamespace = (namespace, events) => {
    const socket = sockets[namespace];
    if (socket) {
      events.forEach((event) => {
        socket.off(event);
      });
    }
  };

  const disconnectAllSockets = () => {
    console.log("모든 소켓 객체의 연결을 해제합니다.");
    Object.values(socketsRef.current).forEach((socket) => {
      if (socket.connected) {
        socket.disconnect();
      }
    });
    setSockets({});
    socketsRef.current = {};
  };

  const isNamespaceConnected = (namespace) => {
    return !!socketsRef.current[namespace];
  };

  const emitNamespace = (namespace, event, data) => {
    const socket = socketsRef.current[namespace];
    if (socket) {
      socket.emitWithTime(event, data);
    }
  };

  useEffect(() => {
    // console.log("SocketContext가 마운트되었습니다.");
    connectNamespace("/");
    connectNamespace("/online_status");
    return () => {
      // console.log("SocketContext가 언마운트되었습니다.");
      disconnectAllSockets();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isNamespaceConnected,
        connectNamespace,
        disconnectNamespace,
        emitNamespace,
        setupEventListenersNamespace,
        removeEventListenersNamespace,
        setupEventListenersSocket,
        removeEventListenersSocket,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export const SocketProviderWrapper = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};
