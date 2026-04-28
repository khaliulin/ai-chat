import { IconFileTypePdf, IconDownload } from "@tabler/icons-react";

export default function AttachmentLink({ file, isCompact }) {
  return (
    <div className={`flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-4 py-3 mt-3 animate-[msg-appear_0.4s_cubic-bezier(0.34,1.56,0.64,1)] ${isCompact ? "w-full" : "w-80"}`}>
      <div className="w-11 h-11 bg-[#FEE2E2] rounded-[10px] flex items-center justify-center text-[#EF4444]">
        <IconFileTypePdf size={32} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#111827] text-ellipsis overflow-hidden whitespace-nowrap">{file.name}</div>
        <div className="text-[11px] text-[#6B7280]">{file.size} · PDF документ</div>
      </div>
      <button className="bg-[#F3F4F6] border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-[#374151] transition-all duration-200" title="Скачать">
        <IconDownload size={18} />
      </button>
    </div>
  );
}
