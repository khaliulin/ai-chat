import { useRef, useEffect } from "react";
import CdekAiLogo from "../common/CdekAiLogo.jsx";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";
import SourcesSection from "../message-content/SourcesSection.jsx";
import CategoryGrid from "../suggestions/CategoryGrid.jsx";
import FollowUpList from "../suggestions/FollowUpList.jsx";

export default function ChatContent({ messages, inputValue, setInputValue, handleSend, isCompact, showGreeting, onQuestionSelect, hasUserSent }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const lastAst = [...messages].reverse().find((m) => m.role === "assistant" && !m.isTyping);
  const lastType = lastAst?.responseType || null;
  const lastDone = messages.length > 0 && messages[messages.length - 1].role === "assistant" && !messages[messages.length - 1].isTyping;

  return (
    <>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isCompact ? "12px 14px" : "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {showGreeting && !hasUserSent && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isCompact ? 14 : 20 }}>
              <CdekAiLogo size={isCompact ? 28 : 36} />
              <span style={{ fontSize: 12, color: "#999" }}>Сегодня</span>
            </div>
            <h2 style={{ fontSize: isCompact ? 16 : 22, fontWeight: 600, color: "#1A1A1A", margin: "0 0 16px 0", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
              Здравствуйте! Я ИИ-помощник СДЭК. Чем могу помочь?
            </h2>
          </div>
        )}
        {(hasUserSent ? messages.filter((m) => m.id !== 1) : []).map((msg) => (
          <MessageBubble key={msg.id} message={msg} isCompact={isCompact} />
        ))}
        {hasUserSent && lastDone && lastType && <SourcesSection isCompact={isCompact} />}
        {!hasUserSent && <CategoryGrid onSelect={onQuestionSelect} isCompact={isCompact} />}
        {hasUserSent && lastDone && lastType && <FollowUpList responseType={lastType} onSelect={onQuestionSelect} isCompact={isCompact} />}
      </div>
      <div style={{ padding: isCompact ? "8px 12px 12px" : "8px 20px 16px" }}>
        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} isCompact={isCompact} />
      </div>
    </>
  );
}
