import { useState } from "react";
import { IconCopy, IconShare, IconVolume, IconRefresh, IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import CdekAiLogo from "../common/CdekAiLogo.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import CodeBlock from "../message-content/CodeBlock.jsx";
import AttachmentLink from "../message-content/AttachmentLink.jsx";
import AIResponseActions from "../message-content/AIResponseActions.jsx";

const actionBtnClass = "bg-none border-none cursor-pointer text-[#999] px-1.5 py-1 rounded-md flex items-center transition-all duration-150";

function renderMessageContent(text) {
  if (!text) return null;
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part && part.startsWith("```")) {
      const lines = part.split("\n");
      const lang = lines[0].replace("```", "").trim();
      const content = lines.slice(1, -1).join("\n");
      return <CodeBlock key={i} content={content} language={lang} />;
    }
    if (!part) return null;
    const subParts = part.split(/(\[.*?\]\(.*?\))/g);
    return (
      <span key={i} className="whitespace-pre-line">
        {subParts.map((sub, j) => {
          const linkMatch = sub.match(/\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            return (
              <a key={`${i}-${j}`} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
                className="text-[#0066FF] no-underline font-medium border-b border-transparent transition-[border-color] duration-200">
                {linkMatch[1]}
              </a>
            );
          }
          return sub;
        })}
      </span>
    );
  });
}

export default function MessageBubble({ message, isCompact }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  return (
    <div className={`flex flex-col gap-1 animate-[msg-appear_0.35s_cubic-bezier(0.34,1.56,0.64,1)] ${isUser ? "items-end" : "items-start"}`}>
      {!isUser && (
        <div className="flex items-center gap-2 mb-0.5">
          <CdekAiLogo size={24} />
          <span className="text-[11px] text-[#BBB]">{message.time}</span>
        </div>
      )}
      {isUser && (
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] text-[#BBB]">{message.time}</span>
          <span className="text-xs text-[#777] font-medium">Вы</span>
          <div className="w-6 h-6 rounded-full bg-[#D4D4D4] flex items-center justify-center text-[11px] font-semibold text-[#555]">П</div>
        </div>
      )}
      <div className={`leading-[1.6] text-[#1A1A1A] whitespace-pre-line ${isUser ? "bg-[#F0F0F0] border-none rounded-[18px_18px_4px_18px]" : "bg-white border border-[#EBEBEB] rounded-[18px_18px_18px_4px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"} ${isCompact ? "px-4 py-3 text-[13px] max-w-full" : "px-5 py-4 text-sm max-w-[85%]"}`}>
        {message.isTyping ? <TypingIndicator /> : renderMessageContent(message.text)}
      </div>
      {!isUser && message.file && <AttachmentLink file={message.file} isCompact={isCompact} />}
      {!isUser && !message.isTyping && (
        <>
          <div className="flex items-center gap-1 mt-1 w-full">
            <button onClick={handleCopy} className={`${actionBtnClass} ${copied ? "!text-[#333]" : ""}`} title={copied ? "Скопировано" : "Копировать"}><IconCopy size={14} /></button>
            <button onClick={handleShare} className={actionBtnClass} title={shared ? "Ссылка скопирована" : "Поделиться"}><IconShare size={14} /></button>
            <button className={actionBtnClass} title="Прослушать"><IconVolume size={14} /></button>
            <button className={actionBtnClass} title="Перегенерировать ответ"><IconRefresh size={14} /></button>
            <div className="flex-1" />
            <button className={actionBtnClass} title="Полезно"><IconThumbUp size={14} /></button>
            <button className={actionBtnClass} title="Не полезно"><IconThumbDown size={14} /></button>
          </div>
          <AIResponseActions isCompact={isCompact} onAction={() => {}} />
        </>
      )}
    </div>
  );
}
