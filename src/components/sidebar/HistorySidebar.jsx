import { IconMenu2, IconEdit, IconPin } from "@tabler/icons-react";
import { useChatHistory } from "../../hooks/useChatHistory.js";
import HistorySearch from "./HistorySearch.jsx";
import HistoryItem from "./HistoryItem.jsx";

const iconOnlyBtn = {
  background: "none", border: "none", cursor: "pointer", color: "#777",
  padding: 6, borderRadius: 8, display: "flex", alignItems: "center",
};

export default function HistorySidebar({ onNewChat, onSelectChat, activeChat, collapsed, onToggle }) {
  const { filteredChats, pinnedChats, groupedChats, searchQuery, setSearchQuery, menuOpenId, setMenuOpenId } = useChatHistory();

  if (collapsed) {
    return (
      <div style={{
        width: 48, height: "100%", background: "#FAFAFA", borderRight: "1px solid #EBEBEB",
        display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 8, flexShrink: 0,
      }}>
        <button onClick={onToggle} style={iconOnlyBtn} title="Развернуть"><IconMenu2 size={18} /></button>
        <button onClick={onNewChat} style={iconOnlyBtn} title="Новый чат"><IconEdit size={16} /></button>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", height: "100%", background: "#FAFAFA", borderRight: "1px solid #EBEBEB",
      display: "flex", flexDirection: "column", flexShrink: 0, fontFamily: "'PT Sans', sans-serif",
    }}>
      <div style={{ padding: "12px 12px 8px", display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={onToggle} style={iconOnlyBtn} title="Свернуть"><IconMenu2 size={18} /></button>
        <div style={{ flex: 1 }} />
        <button onClick={onNewChat} style={{
          display: "flex", alignItems: "center", gap: 6, background: "#1A1A1A",
          color: "#FFF", border: "none", borderRadius: 10, padding: "7px 14px",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>
          <IconEdit size={16} /> Новый чат
        </button>
      </div>

      <HistorySearch value={searchQuery} onChange={setSearchQuery} />

      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {pinnedChats.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 8px 4px", display: "flex", alignItems: "center", gap: 4 }}>
              <IconPin size={12} /> Избранное
            </div>
            {pinnedChats.map((c) => (
              <HistoryItem key={c.id} chat={c} activeChat={activeChat} onSelectChat={onSelectChat} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
            ))}
          </div>
        )}

        {Object.entries(groupedChats).map(([date, chats]) => (
          <div key={date}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 8px 4px" }}>{date}</div>
            {chats.map((c) => (
              <HistoryItem key={c.id} chat={c} activeChat={activeChat} onSelectChat={onSelectChat} menuOpenId={menuOpenId} setMenuOpenId={setMenuOpenId} />
            ))}
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div style={{ padding: 16, fontSize: 12, color: "#AAA", textAlign: "center" }}>Ничего не найдено</div>
        )}
      </div>
    </div>
  );
}
