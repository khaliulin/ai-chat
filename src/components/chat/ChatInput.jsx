import { IconSend, IconMicrophone, IconPaperclip, IconPlayerStop } from "@tabler/icons-react";
import { InputText } from "@cdek/primereact";
import { useVoiceInput } from "../../hooks/useVoiceInput.js";
import { useAutoComplete } from "../../hooks/useAutoComplete.js";
import VoiceWaveform from "./VoiceWaveform.jsx";

const iBtnClass = "bg-none border-none cursor-pointer p-1 flex items-center rounded-lg";

export default function ChatInput({ value, onChange, onSend, isCompact }) {
  const { isRecording, formattedTime, startRecording, cancelRecording, sendRecording } = useVoiceInput((text) => {
    onChange(text);
  });

  const { ghostText, acceptCompletion } = useAutoComplete(value, isRecording);

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && ghostText) {
      e.preventDefault();
      onChange(acceptCompletion());
    } else if (e.key === "Enter" && value.trim()) {
      onSend();
    }
  };

  const handleSendRecording = () => {
    sendRecording();
    setTimeout(() => onSend(), 100);
  };

  if (isRecording) {
    return (
      <div className={`flex items-center gap-2.5 bg-white border-2 border-[#CCC] rounded-2xl animate-[recording-pulse_2s_ease-in-out_infinite] ${isCompact ? "px-3 py-2.5" : "px-4 py-3"}`}>
        <div className="w-2.5 h-2.5 rounded-full bg-[#D44] animate-[rec-dot_1s_ease-in-out_infinite]" />
        <span className="text-xs text-[#777] font-medium min-w-[32px]">{formattedTime}</span>
        <VoiceWaveform />
        <button onClick={cancelRecording} className={`${iBtnClass} text-[#666]`}><IconPlayerStop size={16} /></button>
        <button onClick={handleSendRecording} className="bg-[#1A1A1A] border-none rounded-[10px] px-3.5 py-1.5 text-xs text-white cursor-pointer font-semibold font-[inherit]">Отправить</button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-white border-2 border-[#D4D4D4] rounded-2xl ${isCompact ? "px-3 py-2" : "px-4 py-2.5"}`}>
      <div className="relative flex-1">
        <div className={`absolute top-0 left-0 right-0 text-transparent pointer-events-none whitespace-nowrap overflow-hidden font-[inherit] leading-normal ${isCompact ? "text-[13px]" : "text-sm"}`}>
          {value}<span className="text-[#CCC]">{ghostText}</span>
        </div>
        <InputText value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} placeholder="Напишите сообщение..."
          className={`w-full border-none outline-none text-[#1A1A1A] bg-transparent font-[inherit] relative z-[1] ${isCompact ? "text-[13px]" : "text-sm"}`} />
      </div>
      {ghostText && <span className="text-[10px] text-[#AAA] bg-[#F5F5F5] rounded px-1.5 py-0.5 whitespace-nowrap border border-[#E0E0E0] font-medium shrink-0">Tab ↹</span>}
      <button onClick={startRecording} className={`${iBtnClass} text-[#888]`}><IconMicrophone size={18} /></button>
      <button className={`${iBtnClass} text-[#999]`}><IconPaperclip size={18} /></button>
      <button onClick={() => value.trim() && onSend()} disabled={!value.trim()} className={`${iBtnClass} ${value.trim() ? "text-[#1A1A1A]" : "text-[#CCC]"}`}><IconSend size={20} /></button>
    </div>
  );
}
