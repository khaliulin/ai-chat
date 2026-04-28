import { useState, useEffect } from "react";
import { TYPING_PHRASES } from "../../data/mockResponses.js";

export default function TypingIndicator() {
  const [phrase, setPhrase] = useState(TYPING_PHRASES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase(TYPING_PHRASES[Math.floor(Math.random() * TYPING_PHRASES.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "8px 0", fontStyle: "italic", color: "#888", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: "50%", background: "#999",
            animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      {phrase}
    </div>
  );
}
