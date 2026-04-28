import { IconMenu2, IconEdit, IconPin } from "@tabler/icons-react";
import { useChatHistory } from "../../hooks/useChatHistory.js";
import HistorySearch from "./HistorySearch.jsx";
import HistoryItem from "./HistoryItem.jsx";

const iconOnlyBtnClass = "bg-none border-none cursor-pointer text-[#777] p-1.5 rounded-lg flex items-center";

export default function HistorySidebar({ onNewChat, onSelectChat, activeChat, collapsed, onToggle }) {
  const { filteredChats, pinnedChats, groupedChats, searchQuery, setSearchQuery, menuOpenId, setMenuOpenId } = useChatHistory();

  if (collapsed) {
    return (
      <div className="w-12 h-full bg-[#FAFAFA] border-r border-[#EBEBEB] flex flex-col items-center pt-3 gap-2 shrink-0">
        <button onClick={onToggle} className={iconOnlyBtnClass} title="Развернуть"><IconMenu2 size={18} /></button>
        <button onClick={onNewChat} className={iconOnlyBtnClass} title="Новый чат"><IconEdit size={16} /></button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#FAFAFA] border-r border-[#EBEBEB] flex flex-col shrink-0 font-['PT_Sans',sans-serif]">
      <div className="px-3 pt-3 pb-2 flex items-center gap-1.5">
        <button onClick={onToggle} className={iconOnlyBtnClass} title="Свернуть"><IconMenu2 size={18} /></button>
        <div className="flex-1" />
        <button onClick={onNewChat} className="flex items-center gap-1.5 bg-[#1A1A1A] text-white border-none rounded-[10px] px-3.5 py-[7px] text-xs font-semibold cursor-pointer font-[inherit]">
          <IconEdit size={16} /> Новый чат
        </button>
      </div>

      <HistorySearch value={searchQuery} onChange={setSearchQuery} />

      <div className="flex-1 overflow-y-auto px-2">
        {pinnedChats.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] font-semibold text-[#AAA] uppercase tracking-wide px-2 pt-2.5 pb-1 flex items-center gap-1">
              <IconPin size={12} /> Избранное
            </div>
            {pinnedChats.map((c) => (
              <HistoryItem key={c.id} chat={c} activeChat={activeChat} onSelectChat={onSelectChat} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
            ))}
          </div>
        )}

        {Object.entries(groupedChats).map(([date, chats]) => (
          <div key={date}>
            <div className="text-[10px] font-semibold text-[#AAA] uppercase tracking-wide px-2 pt-2.5 pb-1">{date}</div>
            {chats.map((c) => (
              <HistoryItem key={c.id} chat={c} activeChat={activeChat} onSelectChat={onSelectChat} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
            ))}
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div className="p-4 text-xs text-[#AAA] text-center">Ничего не найдено</div>
        )}
      </div>
    </div>
  );
}
