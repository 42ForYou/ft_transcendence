import React, { useState, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

const TokenRequestButton = () => {
  const requestToken = async () => {
    const response = await fetch(`${process.env.SOCKET_BASE_URL}/issue-token`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.text();
    console.log(data);
  };

  return <button onClick={requestToken}>Request Token</button>;
};

const ChatPage = () => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("chat message", (msg) => {
        setChat([...chat, msg]);
      });

      return () => socket.off("chat message");
    }
  }, [socket, chat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div id="chat">
      <ul>
        {chat.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          id="chat-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" style={{ color: "black" }}>
          Send
        </button>
      </form>
      <TokenRequestButton />
    </div>
  );
};

export default ChatPage;
