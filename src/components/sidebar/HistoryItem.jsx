import { IconMessage, IconDotsVertical } from "@tabler/icons-react";

export default function HistoryItem({ chat, activeChat, onSelectChat, menuOpenId, setMenuOpenId }) {
  return (
    <div className="relative" onMouseLeave={() => setMenuOpenId(null)}>
      <button onClick={() => onSelectChat(chat.id)} className={`flex items-center gap-2 w-full border-none rounded-lg text-left cursor-pointer transition-all duration-150 font-[inherit] relative pr-8 px-2 py-[9px] ${activeChat === chat.id ? "bg-[#EBEBEB]" : "bg-transparent"}`}>
        <IconMessage size={14} />
        <span className={`text-xs text-[#333] overflow-hidden whitespace-nowrap text-ellipsis flex-1 ${activeChat === chat.id ? "font-semibold" : "font-normal"}`}>{chat.title}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === chat.id ? null : chat.id); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none text-[#999] cursor-pointer p-1 rounded flex items-center">
        <IconDotsVertical size={14} />
      </button>
      {menuOpenId === chat.id && (
        <div className="absolute top-full right-2 z-[100] bg-white border border-[#EBEBEB] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] py-1 min-w-[160px]">
          <button className="w-full text-left bg-none border-none px-3 py-2 text-xs text-[#333] cursor-pointer font-[inherit] transition-all duration-150" onClick={() => setMenuOpenId(null)}>Добавить в Избранное</button>
          <button className="w-full text-left bg-none border-none px-3 py-2 text-xs text-[#333] cursor-pointer font-[inherit] transition-all duration-150" onClick={() => setMenuOpenId(null)}>Переименовать беседу</button>
          <button className="w-full text-left bg-none border-none px-3 py-2 text-xs text-[#EF4444] cursor-pointer font-[inherit] transition-all duration-150" onClick={() => setMenuOpenId(null)}>Удалить беседу</button>
        </div>
      )}
    </div>
  );
}
