import avatarImg from "../../assets/avatar.png";

export default function CdekAiLogo({ size = 32 }) {
  return (
    <img
      src={avatarImg}
      alt="AI Assistant"
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}
