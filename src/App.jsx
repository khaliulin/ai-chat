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
    <div className="w-screen h-screen flex flex-col">
      <div className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1A1A1A] font-['PT_Sans',sans-serif] shrink-0">
        <CdekAiLogo size={26} />
        <span className="text-white text-sm font-semibold mr-4">СДЭК AI-помощник</span>
        {VIEW_MODES.map((m) => (
          <button key={m.id} onClick={() => { if (m.id === "float") setFloatInitialOpen(true); setViewMode(m.id); chat.resetChat(); }}
            className={`rounded-[10px] px-4 py-1.5 text-xs font-semibold cursor-pointer font-[inherit] ${viewMode === m.id ? "bg-[#444] text-white border-none" : "bg-[rgba(255,255,255,0.06)] text-[#888] border border-[rgba(255,255,255,0.1)]"}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === "fullpage" && <FullPageLayout {...shared} />}
        {viewMode === "sidebar" && <SidebarLayout {...shared} onMinimize={() => { setFloatInitialOpen(false); setViewMode("float"); }} onExpand={() => setViewMode("fullpage")} />}
        {viewMode === "float" && <FloatLayout {...shared} initialOpen={floatInitialOpen} onExpand={() => setViewMode("fullpage")} />}
        {viewMode === "embedded" && <EmbeddedLayout {...shared} onClose={() => setViewMode("fullpage")} onMinimize={() => setViewMode("float")} onExpand={() => setViewMode("fullpage")} />}
      </div>
    </div>
  );
}
