import { IconWand } from "@tabler/icons-react";

const ACTIONS = ["Развернуть мысль", "Короче", "Больше контекста"];

export default function AIResponseActions({ isCompact, onAction }) {
  return (
    <div className="flex items-center gap-2 bg-[#F5F5F5] border border-[#E8E8E8] rounded-3xl px-3 py-1.5 mt-2 w-fit shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <IconWand size={16} />
      <div className="flex gap-1">
        {ACTIONS.map((act) => (
          <button key={act} onClick={() => onAction(act)} className={`bg-[#EBEBEB] border-none rounded-lg px-3 py-1.5 text-[#666] font-medium cursor-pointer transition-all duration-150 font-[inherit] ${isCompact ? "text-[11px]" : "text-xs"}`}>
            {act}
          </button>
        ))}
      </div>
    </div>
  );
}
