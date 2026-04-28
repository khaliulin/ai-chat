export default function SuggestionChip({ text, onClick }) {
  return (
    <button onClick={onClick} className="bg-[#F5F5F5] border border-[#E8E8E8] rounded-[20px] px-4 py-2 text-[13px] text-[#444] cursor-pointer font-[inherit] transition-all duration-150">
      {text}
    </button>
  );
}
