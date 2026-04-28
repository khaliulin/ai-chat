import { IconMessage, IconDotsVertical } from "@tabler/icons-react";

const menuItemStyle = {
  width: "100%", textAlign: "left", background: "none", border: "none",
  padding: "8px 12px", fontSize: 12, color: "#333", cursor: "pointer",
  fontFamily: "inherit", transition: "background 0.15s",
};

export default function HistoryItem({ chat, activeChat, onSelectChat, menuOpenId, setMenuOpenId }) {
  return (
    <div style={{ position: "relative" }} onMouseLeave={() => setMenuOpenId(null)}>
      <button onClick={() => onSelectChat(chat.id)} style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%",
        background: activeChat === chat.id ? "#EBEBEB" : "transparent",
        border: "none", borderRadius: 8, padding: "9px 8px", textAlign: "left",
        cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit",
        position: "relative", paddingRight: 32,
      }}>
        <IconMessage size={14} />
        <span style={{
          fontSize: 12, color: "#333", overflow: "hidden",
          whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1,
          fontWeight: activeChat === chat.id ? 600 : 400,
        }}>{chat.title}</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === chat.id ? null : chat.id); }}
        style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", color: "#999", cursor: "pointer",
          padding: 4, borderRadius: 4, display: "flex", alignItems: "center",
        }}>
        <IconDotsVertical size={14} />
      </button>
      {menuOpenId === chat.id && (
        <div style={{
          position: "absolute", top: "100%", right: 8, zIndex: 100,
          background: "#FFF", border: "1px solid #EBEBEB", borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0", minWidth: 160,
        }}>
          <button style={menuItemStyle} onClick={() => setMenuOpenId(null)}>Добавить в Избранное</button>
          <button style={menuItemStyle} onClick={() => setMenuOpenId(null)}>Переименовать беседу</button>
          <button style={{ ...menuItemStyle, color: "#EF4444" }} onClick={() => setMenuOpenId(null)}>Удалить беседу</button>
        </div>
      )}
    </div>
  );
}
