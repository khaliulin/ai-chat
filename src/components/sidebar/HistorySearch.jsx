import { IconSearch } from "@tabler/icons-react";

export default function HistorySearch({ value, onChange }) {
  return (
    <div className="px-3 pb-2">
      <div className="flex items-center gap-1.5 bg-white border border-[#E0E0E0] rounded-[10px] px-2.5 py-1.5">
        <IconSearch size={15} />
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск по истории..."
          className="border-none outline-none text-xs flex-1 bg-transparent font-[inherit] text-[#1A1A1A]"
        />
      </div>
    </div>
  );
}
