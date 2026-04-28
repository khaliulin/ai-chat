import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function MessageList({ messages, isCompact }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isCompact ? "12px 14px" : "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} isCompact={isCompact} />
      ))}
    </div>
  );
}
