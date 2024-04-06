import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const useWebSocketConnection = (namespace, eventHandlers, options = {}) => {
  const { connectNamespace, disconnectNamespace, setupEventListeners, removeEventListeners } = useSocket();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!namespace) return;

    connectNamespace(namespace, {
      onConnect: () => setIsConnected(true),
      onConnectError: () => {
        setIsConnected(false);
        if (options.onConnectError) options.onConnectError();
      },
      onDisconnect: () => {
        setIsConnected(false);
        if (options.onDisconnect) options.onDisconnect();
      },
    });

    setupEventListeners(namespace, eventHandlers);

    return () => {
      eventHandlers.forEach(({ event }) => removeEventListeners(namespace, [event]));
      disconnectNamespace(namespace);
    };
  }, [
    namespace,
    eventHandlers,
    connectNamespace,
    disconnectNamespace,
    setupEventListeners,
    removeEventListeners,
    options,
  ]);

  return isConnected;
};

export default useWebSocketConnection;
