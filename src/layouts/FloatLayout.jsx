import { useState } from "react";
import { IconChevronLeft, IconMaximize, IconEdit, IconMinus } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtn = { background: "none", border: "none", cursor: "pointer", color: "#777", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" };

export default function FloatLayout(props) {
  const [isOpen, setIsOpen] = useState(props.initialOpen !== false);
  const [histOpen, setHistOpen] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", fontFamily: "'PT Sans', sans-serif" }}>
      <PageSkeleton />
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{
          position: "absolute", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: "50%", background: "#1A1A1A", border: "none", cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center",
          justifyContent: "center", animation: "fab-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", transition: "transform 0.2s",
        }}>
          <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>AI</span>
        </button>
      )}
      {isOpen && (
        <div style={{
          position: "absolute", bottom: 24, right: 24, width: 370, height: 520,
          background: "#FFF", borderRadius: 20,
          boxShadow: "0 12px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "float-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)", border: "1px solid #E0E0E0",
        }}>
          {histOpen && (
            <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: "#FFF", zIndex: 10, borderTop: "1px solid #EBEBEB", borderRadius: "0 0 20px 20px", overflow: "hidden" }}>
              <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #EBEBEB", gap: 4 }}>
            <button onClick={() => setHistOpen(!histOpen)} style={hdrBtn} title="История"><IconChevronLeft size={18} /></button>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginLeft: 4 }}>ИИ-чат</span>
            <button onClick={props.onExpand} style={hdrBtn} title="Развернуть"><IconMaximize size={16} /></button>
            <button onClick={() => { props.onNewChat?.(); }} style={hdrBtn} title="Новый чат"><IconEdit size={16} /></button>
            <button onClick={() => setIsOpen(false)} style={hdrBtn} title="Свернуть"><IconMinus size={18} /></button>
          </div>
          <ChatContent {...props} isCompact={true} showGreeting={true} />
        </div>
      )}
    </div>
  );
}
