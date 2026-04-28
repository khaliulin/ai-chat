const sk = (w, h, r = 6) => ({
  height: h,
  width: w,
  background: "linear-gradient(90deg, #F0F0F0 25%, #E4E4E4 50%, #F0F0F0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.6s infinite",
  borderRadius: r,
  flexShrink: 0,
});

export default function PageSkeleton() {
  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", background: "#F9FAFB", fontFamily: "'PT Sans', sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px" }}>
        <div style={sk("220px", 28, 8)} />
        <div style={{ ...sk("360px", 16, 6), marginTop: 10, marginBottom: 32 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 40 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ padding: 20, background: "#FFF", borderRadius: 16, border: "1px solid #E5E7EB" }}>
              <div style={sk("55%", 14, 4)} />
              <div style={{ ...sk("35%", 12, 4), marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "#E5E7EB", marginBottom: 32 }} />
        <div style={sk("65%", 20, 6)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <div style={sk("100%", 14, 4)} />
          <div style={sk("100%", 14, 4)} />
          <div style={sk("82%", 14, 4)} />
          <div style={{ ...sk("100%", 72, 12), marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}
