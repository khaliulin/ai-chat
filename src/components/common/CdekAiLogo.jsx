import avatarImg from "../../assets/avatar.png";

export default function CdekAiLogo({ size = 32 }) {
  return (
    <img
      src={avatarImg}
      alt="AI Assistant"
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
