import { Card } from "primereact/card";

export default function HintCard({ icon, title, description, onClick }) {
  return (
    <Card className="hint-card cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-semibold text-sm">{title}</div>
          {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
        </div>
      </div>
    </Card>
  );
}
