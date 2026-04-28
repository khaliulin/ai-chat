import { useState } from "react";
import { IconChevronLeft, IconEdit, IconSettings, IconLayoutSidebar } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtnClass = "bg-none border-none cursor-pointer text-[#777] p-1.5 rounded-lg flex items-center";
const hdrCircleBtnClass = "bg-[#F5F5F5] border-none cursor-pointer text-[#1A1A1A] p-2.5 rounded-full flex items-center transition-all duration-200";

export default function EmbeddedLayout(props) {
  const [histOpen, setHistOpen] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);

  return (
    <div className="w-full h-full flex bg-white relative font-['PT_Sans',sans-serif]">
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <div className="px-10 py-4 flex items-center justify-end gap-2 bg-[#F9FAFB] border-b border-[#F0F0F0] shrink-0">
          <button className={hdrCircleBtnClass} title="Настройки"><IconSettings size={20} /></button>
          <button onClick={() => setChatVisible(!chatVisible)} className={`${hdrCircleBtnClass} ${chatVisible ? "!bg-[#EBEBEB]" : "!bg-none"}`} title={chatVisible ? "Скрыть правое меню" : "Показать правое меню"}>
            <IconLayoutSidebar size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <PageSkeleton />
        </div>
      </div>

      {chatVisible && (
        <div className="w-[400px] m-3 rounded-3xl flex flex-col bg-white relative overflow-hidden border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.04)] animate-[msg-appear_0.3s_ease-out]">
          {histOpen && (
            <div className="absolute top-11 left-0 right-0 bottom-0 bg-white z-10 flex flex-col border-t border-[#EBEBEB]">
              <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
            </div>
          )}
          <div className="flex items-center px-3 py-2.5 border-b border-[#EBEBEB] gap-1">
            <button onClick={() => setHistOpen(!histOpen)} className={hdrBtnClass} title="История"><IconChevronLeft size={18} /></button>
            <span className="flex-1 text-[13px] font-semibold text-[#111827] ml-1">ИИ-чат</span>
            <button onClick={() => { props.onNewChat?.(); }} className={hdrBtnClass} title="Новый чат"><IconEdit size={16} /></button>
          </div>
          <ChatContent {...props} isCompact={true} showGreeting={true} />
        </div>
      )}
    </div>
  );
}
