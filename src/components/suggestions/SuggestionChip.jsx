import { Chip } from "primereact/chip";

export default function SuggestionChip({ text, onClick }) {
  return (
    <Chip label={text} className="suggestion-chip cursor-pointer" onClick={onClick} />
  );
}
