import { Avatar } from "primereact/avatar";
import avatarImg from "../../assets/avatar.png";

export default function CdekAiLogo({ size = 32 }) {
  const primeSize = size >= 36 ? "large" : "normal";
  return (
    <Avatar image={avatarImg} shape="circle" size={primeSize} className="shrink-0"
      style={{ width: size, height: size }} />
  );
}
