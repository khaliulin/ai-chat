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
      <div ref={scrollRef} className={`flex-1 overflow-y-auto flex flex-col gap-5 ${isCompact ? "px-3.5 py-3" : "px-6 py-5"}`}>
        {showGreeting && !hasUserSent && (
          <div className="mb-2">
            <div className={`flex items-center gap-2.5 ${isCompact ? "mb-3.5" : "mb-5"}`}>
              <CdekAiLogo size={isCompact ? 28 : 36} />
              <span className="text-xs text-[#999]">Сегодня</span>
            </div>
            <h2 className={`font-semibold text-[#1A1A1A] mb-4 leading-[1.4] tracking-tight mt-0 mx-0 ${isCompact ? "text-base" : "text-[22px]"}`}>
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
      <div className={isCompact ? "px-3 pt-2 pb-3" : "px-5 pt-2 pb-4"}>
        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} isCompact={isCompact} />
      </div>
    </>
  );
}
