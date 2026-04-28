export default function VoiceWaveform() {
  return (
    <div className="flex items-center gap-0.5 h-6 flex-1">
      {Array.from({ length: 32 }).map((_, i) => (
        <div key={i} className="w-[3px] rounded-sm bg-[#555]"
          style={{ animation: `waveform ${0.6 + Math.random() * 0.6}s ease-in-out ${i * 0.03}s infinite alternate`, minHeight: 3 }} />
      ))}
    </div>
  );
}
