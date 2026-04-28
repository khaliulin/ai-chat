import { IconFileTypePdf, IconDownload } from "@tabler/icons-react";

export default function AttachmentLink({ file, isCompact }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, background: "#F9FAFB",
      border: "1px solid #E5E7EB", borderRadius: 16, padding: "12px 16px",
      marginTop: 12, width: isCompact ? "100%" : "320px",
      animation: "msg-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      <div style={{
        width: 44, height: 44, background: "#FEE2E2", borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444",
      }}>
        <IconFileTypePdf size={32} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{file.name}</div>
        <div style={{ fontSize: 11, color: "#6B7280" }}>{file.size} · PDF документ</div>
      </div>
      <button style={{
        background: "#F3F4F6", border: "none", borderRadius: "50%",
        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#374151", transition: "all 0.2s",
      }} title="Скачать">
        <IconDownload size={18} />
      </button>
    </div>
  );
}
