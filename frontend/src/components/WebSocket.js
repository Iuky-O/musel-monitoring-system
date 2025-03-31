import React, { useState } from "react";
import useWebSocket from "react-use-websocket";

const SerialMonitor = () => {
  const [messages, setMessages] = useState([]);
  const { sendMessage, lastMessage } = useWebSocket("ws://127.0.0.1:8000/ws", {
    onMessage: (event) => {
      setMessages((prev) => [...prev, event.data]);
    },
  });

  return (
    <div>
      <h2>Monitor Serial</h2>
      <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default SerialMonitor;
