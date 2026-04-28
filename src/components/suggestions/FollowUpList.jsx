import { IconChevronRight } from "@tabler/icons-react";
import { FOLLOW_UP_QUESTIONS } from "../../data/chatHistory.js";

export default function FollowUpList({ responseType, onSelect, isCompact }) {
  const list = FOLLOW_UP_QUESTIONS[responseType] || FOLLOW_UP_QUESTIONS.default;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      {list.map((q, i) => (
        <button key={i} onClick={() => onSelect(q)} style={{
          background: "transparent", border: "none", padding: isCompact ? "10px 4px" : "12px 4px",
          fontSize: isCompact ? 12 : 13, color: "#444", textAlign: "left", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #F0F0F0", transition: "all 0.15s", fontFamily: "inherit",
        }}>
          <span>{q}</span>
          <IconChevronRight size={14} />
        </button>
      ))}
    </div>
  );
}
