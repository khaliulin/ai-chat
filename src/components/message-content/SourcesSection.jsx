import { useState } from "react";
import { SOURCES } from "../../data/mockResponses.js";

export default function SourcesSection({ isCompact }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? SOURCES : SOURCES.slice(0, 3);

  return (
    <div className="mt-1">
      <div className="text-xs text-[#777] font-medium mb-2 flex items-center gap-1">
        Источники
        <span className="bg-[#F0F0F0] text-[#555] rounded-[10px] px-1.5 py-px text-[10px] font-semibold">{SOURCES.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((s, i) => (
          <div key={i} className={`bg-[#F5F5F5] rounded-[20px] px-3 py-[5px] text-[#444] cursor-pointer flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis border border-[#E8E8E8] ${isCompact ? "text-[10px] max-w-full" : "text-[11px] max-w-[280px]"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#888] shrink-0" />
            {s.label}
          </div>
        ))}
        {!expanded && (
          <button onClick={() => setExpanded(true)} className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-[20px] px-3 py-[5px] text-[11px] text-[#777] cursor-pointer font-[inherit]">
            ← Ещё источники
          </button>
        )}
      </div>
    </div>
  );
}
