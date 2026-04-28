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
    <div className="w-full h-full overflow-y-auto bg-[#F9FAFB] font-['PT_Sans',sans-serif]">
      <div className="max-w-[700px] mx-auto p-10">
        <div style={sk("220px", 28, 8)} />
        <div style={{ ...sk("360px", 16, 6), marginTop: 10, marginBottom: 32 }} />
        <div className="grid grid-cols-2 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-[#E5E7EB]">
              <div style={sk("55%", 14, 4)} />
              <div style={{ ...sk("35%", 12, 4), marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div className="h-px bg-[#E5E7EB] mb-8" />
        <div style={sk("65%", 20, 6)} />
        <div className="flex flex-col gap-2.5 mt-4">
          <div style={sk("100%", 14, 4)} />
          <div style={sk("100%", 14, 4)} />
          <div style={sk("82%", 14, 4)} />
          <div style={{ ...sk("100%", 72, 12), marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
}
