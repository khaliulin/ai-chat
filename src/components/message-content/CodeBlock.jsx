import { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";

export default function CodeBlock({ content, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlight = (code) => {
    if (!code) return "";
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span style="color: #E6DB74">$1</span>');
    html = html.replace(/(#.*$|\/\/.*$)/gm, '<span style="color: #75715E">$1</span>');

    const keywords = /\b(curl|POST|GET|Authorization|Bearer|Content-Type|packages|recipient|from_location|to_location|type|number|tariff_code|name|phones|address|weight|length|width|height|orders|location)\b/g;
    html = html.replace(keywords, '<span style="color: #66D9EF; font-weight: 500">$1</span>');
    html = html.replace(/( -H | -d | -X | --data | --header )/g, '<span style="color: #A6E22E">$1</span>');
    html = html.replace(/\b(\d+)\b/g, '<span style="color: #AE81FF">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const lines = content.split("\n");

  return (
    <div style={{
      position: "relative", background: "#121212", borderRadius: "12px",
      margin: "14px 0", border: "1px solid #2A2A2A", overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 14px", background: "#1E1E1E", borderBottom: "1px solid #2A2A2A",
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F56" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27C93F" }} />
          <span style={{ fontSize: "10px", color: "#666", marginLeft: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>{language || "bash"}</span>
        </div>
        <button onClick={handleCopy} style={{
          background: copied ? "#27C93F22" : "rgba(255,255,255,0.05)",
          border: "1px solid", borderColor: copied ? "#27C93F44" : "#444",
          borderRadius: "6px", color: copied ? "#27C93F" : "#BBB",
          fontSize: "11px", padding: "4px 10px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
          fontFamily: "inherit", fontWeight: 500,
        }}>
          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <div style={{ display: "flex", position: "relative", overflowX: "auto" }}>
        <div style={{
          padding: "16px 12px", background: "#181818", borderRight: "1px solid #2A2A2A",
          textAlign: "right", userSelect: "none", color: "#444", fontSize: "12px",
          fontFamily: "monospace", minWidth: "35px", flexShrink: 0,
        }}>
          {lines.map((_, i) => (<div key={i} style={{ height: "1.6em" }}>{i + 1}</div>))}
        </div>
        <pre style={{
          margin: 0, padding: "16px", flex: 1,
          fontSize: "12px", color: "#F8F8F2", fontFamily: "'Fira Code', 'JetBrains Mono', 'Monaco', monospace",
          lineHeight: 1.6, whiteSpace: "pre",
        }}>
          <code>{highlight(content)}</code>
        </pre>
      </div>
    </div>
  );
}
