import { useState } from "react";
import { SOURCES } from "../../data/mockResponses.js";

export default function SourcesSection({ isCompact }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? SOURCES : SOURCES.slice(0, 3);

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ fontSize: 12, color: "#777", fontWeight: 500, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
        Источники
        <span style={{ background: "#F0F0F0", color: "#555", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 600 }}>{SOURCES.length}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {shown.map((s, i) => (
          <div key={i} style={{
            background: "#F5F5F5", borderRadius: 20, padding: "5px 12px",
            fontSize: isCompact ? 10 : 11, color: "#444", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            maxWidth: isCompact ? "100%" : 280, overflow: "hidden",
            whiteSpace: "nowrap", textOverflow: "ellipsis", border: "1px solid #E8E8E8",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#888", flexShrink: 0 }} />
            {s.label}
          </div>
        ))}
        {!expanded && (
          <button onClick={() => setExpanded(true)} style={{
            background: "#FAFAFA", border: "1px solid #E0E0E0", borderRadius: 20,
            padding: "5px 12px", fontSize: 11, color: "#777", cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Ещё источники
          </button>
        )}
      </div>
    </div>
  );
}
