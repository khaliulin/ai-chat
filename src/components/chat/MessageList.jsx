import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function MessageList({ messages, isCompact }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollRef} className={`flex-1 overflow-y-auto flex flex-col gap-5 ${isCompact ? "px-3.5 py-3" : "px-6 py-5"}`}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} isCompact={isCompact} />
      ))}
    </div>
  );
}
