import { useState } from "react";
import { IconChevronLeft, IconEdit, IconSettings, IconLayoutSidebar } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };
const hdrCircleBtn = { background: "#F5F5F5", border: "none", cursor: "pointer", color: "#1A1A1A", padding: 10, borderRadius: "50%", display: "flex", alignItems: "center", transition: "all 0.2s" };

export default function EmbeddedLayout(props) {
  const [histOpen, setHistOpen] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#FFF", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, background: "#F9FAFB", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
          <button style={hdrCircleBtn} title="Настройки"><IconSettings size={20} /></button>
          <button onClick={() => setChatVisible(!chatVisible)} style={{ ...hdrCircleBtn, background: chatVisible ? "#EBEBEB" : "none" }} title={chatVisible ? "Скрыть правое меню" : "Показать правое меню"}>
            <IconLayoutSidebar size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <PageSkeleton />
        </div>
      </div>

      {chatVisible && (
        <div style={{
          width: 400, margin: 12, borderRadius: 24,
          display: "flex", flexDirection: "column", background: "#FFF",
          position: "relative", overflow: "hidden",
          border: "1px solid #E5E7EB",
          boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
          animation: "msg-appear 0.3s ease-out",
        }}>
          {histOpen && (
            <div style={{
              position: "absolute", top: 44, left: 0, right: 0, bottom: 0,
              background: "#FFF", zIndex: 10, display: "flex", flexDirection: "column",
              borderTop: "1px solid #EBEBEB",
            }}>
              <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #EBEBEB", gap: 4 }}>
            <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconChevronLeft size={18} /></button>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#111827", marginLeft: 4 }}>ИИ-чат</span>
            <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconEdit size={16} /></button>
          </div>
          <ChatContent {...props} isCompact={true} showGreeting={true} />
        </div>
      )}
    </div>
  );
}
