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
    <div className="py-2 italic text-[#888] text-[13px] flex items-center gap-2">
      <div className="flex gap-[3px]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-[#999]"
            style={{ animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      {phrase}
    </div>
  );
}
