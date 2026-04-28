export default function VoiceWaveform() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 24, flex: 1 }}>
      {Array.from({ length: 32 }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2, background: "#555",
          animation: `waveform ${0.6 + Math.random() * 0.6}s ease-in-out ${i * 0.03}s infinite alternate`,
          minHeight: 3,
        }} />
      ))}
    </div>
  );
}
