import { useState } from "react";
import { IconChevronLeft, IconMaximize, IconEdit, IconMinus } from "@tabler/icons-react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";
import PageSkeleton from "../components/common/PageSkeleton.jsx";

const hdrBtnClass = "bg-none border-none cursor-pointer text-[#777] p-1.5 rounded-lg flex items-center";

export default function FloatLayout(props) {
  const [isOpen, setIsOpen] = useState(props.initialOpen !== false);
  const [histOpen, setHistOpen] = useState(false);

  return (
    <div className="w-full h-full relative font-['PT_Sans',sans-serif]">
      <PageSkeleton />
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#1A1A1A] border-none cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center animate-[fab-appear_0.4s_cubic-bezier(0.34,1.56,0.64,1)] transition-transform duration-200">
          <span className="text-white text-sm font-bold">AI</span>
        </button>
      )}
      {isOpen && (
        <div className="absolute bottom-6 right-6 w-[370px] h-[520px] bg-white rounded-[20px] shadow-[0_12px_48px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-[float-appear_0.35s_cubic-bezier(0.34,1.56,0.64,1)] border border-[#E0E0E0]">
          {histOpen && (
            <div className="absolute top-11 left-0 right-0 bottom-0 bg-white z-10 border-t border-[#EBEBEB] rounded-b-[20px] overflow-hidden">
              <HistorySidebar onNewChat={() => { props.onNewChat?.(); setHistOpen(false); }} onSelectChat={() => setHistOpen(false)} activeChat="h1" collapsed={false} onToggle={() => setHistOpen(false)} />
            </div>
          )}
          <div className="flex items-center px-3 py-2.5 border-b border-[#EBEBEB] gap-1">
            <button onClick={() => setHistOpen(!histOpen)} className={hdrBtnClass} title="История"><IconChevronLeft size={18} /></button>
            <span className="flex-1 text-[13px] font-semibold text-[#1A1A1A] ml-1">ИИ-чат</span>
            <button onClick={props.onExpand} className={hdrBtnClass} title="Развернуть"><IconMaximize size={16} /></button>
            <button onClick={() => { props.onNewChat?.(); }} className={hdrBtnClass} title="Новый чат"><IconEdit size={16} /></button>
            <button onClick={() => setIsOpen(false)} className={hdrBtnClass} title="Свернуть"><IconMinus size={18} /></button>
          </div>
          <ChatContent {...props} isCompact={true} showGreeting={true} />
        </div>
      )}
    </div>
  );
}
