import { IconWand } from "@tabler/icons-react";

const ACTIONS = ["Развернуть мысль", "Короче", "Больше контекста"];

export default function AIResponseActions({ isCompact, onAction }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, background: "#F5F5F5",
      border: "1px solid #E8E8E8", borderRadius: 24, padding: "6px 12px", marginTop: 8,
      width: "fit-content", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    }}>
      <IconWand size={16} />
      <div style={{ display: "flex", gap: 4 }}>
        {ACTIONS.map((act) => (
          <button key={act} onClick={() => onAction(act)} style={{
            background: "#EBEBEB", border: "none", borderRadius: 8,
            padding: "6px 12px", fontSize: isCompact ? 11 : 12, color: "#666",
            fontWeight: 500, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
          }}>
            {act}
          </button>
        ))}
      </div>
    </div>
  );
}
