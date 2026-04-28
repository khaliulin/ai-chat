import { IconSend, IconMicrophone, IconPaperclip, IconPlayerStop } from "@tabler/icons-react";
import { useVoiceInput } from "../../hooks/useVoiceInput.js";
import { useAutoComplete } from "../../hooks/useAutoComplete.js";
import VoiceWaveform from "./VoiceWaveform.jsx";

const iBtnS = { background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", borderRadius: 8 };

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
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFF", border: "2px solid #CCC", borderRadius: 16, padding: isCompact ? "10px 12px" : "12px 16px", animation: "recording-pulse 2s ease-in-out infinite" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D44", animation: "rec-dot 1s ease-in-out infinite" }} />
        <span style={{ fontSize: 12, color: "#777", fontWeight: 500, minWidth: 32 }}>{formattedTime}</span>
        <VoiceWaveform />
        <button onClick={cancelRecording} style={{ ...iBtnS, color: "#666" }}><IconPlayerStop size={16} /></button>
        <button onClick={handleSendRecording} style={{ background: "#1A1A1A", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, color: "#FFF", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Отправить</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF", border: "2px solid #D4D4D4", borderRadius: 16, padding: isCompact ? "8px 12px" : "10px 16px" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, fontSize: isCompact ? 13 : 14, color: "transparent", pointerEvents: "none", whiteSpace: "nowrap", overflow: "hidden", fontFamily: "inherit", lineHeight: "normal" }}>
          {value}<span style={{ color: "#CCC" }}>{ghostText}</span>
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} placeholder="Напишите сообщение..."
          style={{ width: "100%", border: "none", outline: "none", fontSize: isCompact ? 13 : 14, color: "#1A1A1A", background: "transparent", fontFamily: "inherit", position: "relative", zIndex: 1 }} />
      </div>
      {ghostText && <span style={{ fontSize: 10, color: "#AAA", background: "#F5F5F5", borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap", border: "1px solid #E0E0E0", fontWeight: 500, flexShrink: 0 }}>Tab ↹</span>}
      <button onClick={startRecording} style={{ ...iBtnS, color: "#888" }}><IconMicrophone size={18} /></button>
      <button style={{ ...iBtnS, color: "#999" }}><IconPaperclip size={18} /></button>
      <button onClick={() => value.trim() && onSend()} disabled={!value.trim()} style={{ ...iBtnS, color: value.trim() ? "#1A1A1A" : "#CCC" }}><IconSend size={20} /></button>
    </div>
  );
}
