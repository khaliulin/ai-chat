export default function SuggestionChip({ text, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "#F5F5F5", border: "1px solid #E8E8E8", borderRadius: 20,
      padding: "8px 16px", fontSize: 13, color: "#444", cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
    }}>
      {text}
    </button>
  );
}
