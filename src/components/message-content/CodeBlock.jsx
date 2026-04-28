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
    <div className="relative bg-[#121212] rounded-xl my-3.5 border border-[#2A2A2A] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      <div className="flex justify-between items-center px-3.5 py-2 bg-[#1E1E1E] border-b border-[#2A2A2A]">
        <div className="flex gap-[5px]">
          <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
          <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
          <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
          <span className="text-[10px] text-[#666] ml-2 font-semibold uppercase tracking-[0.02em]">{language || "bash"}</span>
        </div>
        <button onClick={handleCopy} className={`border rounded-md text-[11px] px-2.5 py-1 cursor-pointer flex items-center gap-1.5 transition-all duration-200 font-[inherit] font-medium ${copied ? "bg-[#27C93F22] border-[#27C93F44] text-[#27C93F]" : "bg-[rgba(255,255,255,0.05)] border-[#444] text-[#BBB]"}`}>
          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <div className="flex relative overflow-x-auto">
        <div className="p-4 pl-3 bg-[#181818] border-r border-[#2A2A2A] text-right select-none text-[#444] text-xs font-mono min-w-[35px] shrink-0">
          {lines.map((_, i) => (<div key={i} className="h-[1.6em]">{i + 1}</div>))}
        </div>
        <pre className="m-0 p-4 flex-1 text-xs text-[#F8F8F2] font-['Fira_Code','JetBrains_Mono','Monaco',monospace] leading-[1.6] whitespace-pre">
          <code>{highlight(content)}</code>
        </pre>
      </div>
    </div>
  );
}
