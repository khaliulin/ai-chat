import { useState } from "react";
import { IconCopy, IconShare, IconVolume, IconRefresh, IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import CdekAiLogo from "../common/CdekAiLogo.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import CodeBlock from "../message-content/CodeBlock.jsx";
import AttachmentLink from "../message-content/AttachmentLink.jsx";
import AIResponseActions from "../message-content/AIResponseActions.jsx";

const actionBtnStyle = {
  background: "none", border: "none", cursor: "pointer", color: "#999",
  padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center", transition: "all 0.15s",
};

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
      <span key={i} style={{ whiteSpace: "pre-line" }}>
        {subParts.map((sub, j) => {
          const linkMatch = sub.match(/\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            return (
              <a key={`${i}-${j}`} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
                style={{ color: "#0066FF", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid transparent", transition: "border-color 0.2s" }}>
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
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start", gap: 4,
      animation: "msg-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      {!isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <CdekAiLogo size={24} />
          <span style={{ fontSize: 11, color: "#BBB" }}>{message.time}</span>
        </div>
      )}
      {isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 11, color: "#BBB" }}>{message.time}</span>
          <span style={{ fontSize: 12, color: "#777", fontWeight: 500 }}>Вы</span>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#D4D4D4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#555" }}>П</div>
        </div>
      )}
      <div style={{
        background: isUser ? "#F0F0F0" : "#FFF",
        border: isUser ? "none" : "1px solid #EBEBEB",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: isCompact ? "12px 16px" : "16px 20px",
        maxWidth: isCompact ? "100%" : "85%",
        fontSize: isCompact ? 13 : 14, lineHeight: 1.6, color: "#1A1A1A",
        whiteSpace: "pre-line", boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        {message.isTyping ? <TypingIndicator /> : renderMessageContent(message.text)}
      </div>
      {!isUser && message.file && <AttachmentLink file={message.file} isCompact={isCompact} />}
      {!isUser && !message.isTyping && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, width: "100%" }}>
            <button onClick={handleCopy} style={{ ...actionBtnStyle, color: copied ? "#333" : "#999" }} title={copied ? "Скопировано" : "Копировать"}><IconCopy size={14} /></button>
            <button onClick={handleShare} style={actionBtnStyle} title={shared ? "Ссылка скопирована" : "Поделиться"}><IconShare size={14} /></button>
            <button style={actionBtnStyle} title="Прослушать"><IconVolume size={14} /></button>
            <button style={actionBtnStyle} title="Перегенерировать ответ"><IconRefresh size={14} /></button>
            <div style={{ flex: 1 }} />
            <button style={actionBtnStyle} title="Полезно"><IconThumbUp size={14} /></button>
            <button style={actionBtnStyle} title="Не полезно"><IconThumbDown size={14} /></button>
          </div>
          <AIResponseActions isCompact={isCompact} onAction={() => {}} />
        </>
      )}
    </div>
  );
}
