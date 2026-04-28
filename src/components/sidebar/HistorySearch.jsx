import { IconSearch } from "@tabler/icons-react";

export default function HistorySearch({ value, onChange }) {
  return (
    <div style={{ padding: "0 12px 8px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, background: "#FFF",
        border: "1px solid #E0E0E0", borderRadius: 10, padding: "6px 10px",
      }}>
        <IconSearch size={15} />
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск по истории..."
          style={{ border: "none", outline: "none", fontSize: 12, flex: 1, background: "transparent", fontFamily: "inherit", color: "#1A1A1A" }}
        />
      </div>
    </div>
  );
}
