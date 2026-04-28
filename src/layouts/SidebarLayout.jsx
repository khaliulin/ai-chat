import { useState } from "react";
import { IconChevronLeft, IconMaximize, IconEdit, IconMinus } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };

export default function SidebarLayout(props) {
  const [histOpen, setHistOpen] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
      <PageSkeleton />
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: 380, borderLeft: "1px solid #E0E0E0",
        background: "#FFF", display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.08)",
        animation: "sidebar-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>ИИ-чат</span>
          <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconMaximize size={16} /></button>
          <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconEdit size={16} /></button>
          <button onClick={props.onMinimize} style={hdrBtn} title="Свернуть"><IconMinus size={18} /></button>
        </div>
        <ChatContent {...props} isCompact={true} showGreeting={true} />
      </div>
    </div>
  );
}
