import { useState } from "react";
import { useChat } from "./hooks/useChat.js";
import CdekAiLogo from "./components/common/CdekAiLogo.jsx";
import FullPageLayout from "./layouts/FullPageLayout.jsx";
import SidebarLayout from "./layouts/SidebarLayout.jsx";
import FloatLayout from "./layouts/FloatLayout.jsx";
import EmbeddedLayout from "./layouts/EmbeddedLayout.jsx";

const VIEW_MODES = [
  { id: "fullpage", label: "Весь экран" },
  { id: "sidebar", label: "Боковая панель" },
  { id: "float", label: "Плавающий" },
  { id: "embedded", label: "Встроенный" },
];

export default function App() {
  const [viewMode, setViewMode] = useState("fullpage");
  const [floatInitialOpen, setFloatInitialOpen] = useState(true);
  const chat = useChat();

  const shared = {
    messages: chat.messages,
    inputValue: chat.inputValue,
    setInputValue: chat.setInputValue,
    handleSend: chat.handleSend,
    onQuestionSelect: chat.handleQuestionSelect,
    hasUserSent: chat.hasUserSent,
    onNewChat: chat.resetChat,
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#1A1A1A", fontFamily: "'PT Sans', sans-serif", flexShrink: 0 }}>
        <CdekAiLogo size={26} />
        <span style={{ color: "#FFF", fontSize: 14, fontWeight: 600, marginRight: 16 }}>СДЭК AI-помощник</span>
        {VIEW_MODES.map((m) => (
          <button key={m.id} onClick={() => { if (m.id === "float") setFloatInitialOpen(true); setViewMode(m.id); chat.resetChat(); }} style={{
            background: viewMode === m.id ? "#444" : "rgba(255,255,255,0.06)",
            color: viewMode === m.id ? "#FFF" : "#888",
            border: viewMode === m.id ? "none" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>{m.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {viewMode === "fullpage" && <FullPageLayout {...shared} />}
        {viewMode === "sidebar" && <SidebarLayout {...shared} onMinimize={() => { setFloatInitialOpen(false); setViewMode("float"); }} onExpand={() => setViewMode("fullpage")} />}
        {viewMode === "float" && <FloatLayout {...shared} initialOpen={floatInitialOpen} onExpand={() => setViewMode("fullpage")} />}
        {viewMode === "embedded" && <EmbeddedLayout {...shared} onClose={() => setViewMode("fullpage")} onMinimize={() => setViewMode("float")} onExpand={() => setViewMode("fullpage")} />}
      </div>
    </div>
  );
}
