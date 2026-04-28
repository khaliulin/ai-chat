import { useState } from "react";
import { IconChevronLeft, IconMaximize, IconEdit, IconMinus } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtnClass = "bg-none border-none cursor-pointer text-[#777] p-1.5 rounded-lg flex items-center";

export default function SidebarLayout(props) {
  const [histOpen, setHistOpen] = useState(false);

  return (
    <div className="w-full h-full relative font-['PT_Sans',sans-serif]">
      <PageSkeleton />
      <div className="absolute top-0 right-0 bottom-0 w-[380px] border-l border-[#E0E0E0] bg-white flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.08)] animate-[sidebar-in_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)]">
        {histOpen && (
          <div className="absolute top-11 left-0 right-0 bottom-0 bg-white z-10 flex flex-col border-t border-[#EBEBEB]">
            <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
          </div>
        )}
        <div className="flex items-center px-3 py-2.5 border-b border-[#EBEBEB] gap-1">
          <button onClick={() => setHistOpen(!histOpen)} className={hdrBtnClass} title="История"><IconChevronLeft size={18} /></button>
          <span className="flex-1 text-[13px] font-semibold text-[#1A1A1A] ml-1">ИИ-чат</span>
          <button onClick={props.onExpand} className={hdrBtnClass} title="Развернуть"><IconMaximize size={16} /></button>
          <button onClick={() => { props.onNewChat?.(); }} className={hdrBtnClass} title="Новый чат"><IconEdit size={16} /></button>
          <button onClick={props.onMinimize} className={hdrBtnClass} title="Свернуть"><IconMinus size={18} /></button>
        </div>
        <ChatContent {...props} isCompact={true} showGreeting={true} />
      </div>
    </div>
  );
}
