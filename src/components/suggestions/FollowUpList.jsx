import { IconChevronRight } from "@tabler/icons-react";
import { FOLLOW_UP_QUESTIONS } from "../../data/chatHistory.js";

export default function FollowUpList({ responseType, onSelect, isCompact }) {
  const list = FOLLOW_UP_QUESTIONS[responseType] || FOLLOW_UP_QUESTIONS.default;

  return (
    <div className="flex flex-col gap-px animate-[msg-appear_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
      {list.map((q, i) => (
        <button key={i} onClick={() => onSelect(q)} className={`bg-transparent border-none text-[#444] text-left cursor-pointer flex items-center justify-between border-b border-[#F0F0F0] transition-all duration-150 font-[inherit] ${isCompact ? "py-2.5 px-1 text-xs" : "py-3 px-1 text-[13px]"}`}>
          <span>{q}</span>
          <IconChevronRight size={14} />
        </button>
      ))}
    </div>
  );
}
