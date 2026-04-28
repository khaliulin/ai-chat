import { useState, useCallback } from "react";
import { INITIAL_MESSAGES, DEMO_RESPONSES, getResponseKey } from "../data/mockResponses.js";

export function useChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [hasUserSent, setHasUserSent] = useState(false);
  const [activeChat, setActiveChat] = useState("h1");

  const doSend = useCallback((text) => {
    const txt = text.trim();
    if (!txt) return;
    setHasUserSent(true);
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setMessages((p) => [
      ...p,
      { id: Date.now(), role: "user", text: txt, time: now },
      { id: Date.now() + 1, role: "assistant", text: "", isTyping: true, time: "", responseType: null },
    ]);
    setInputValue("");
    const key = getResponseKey(txt);
    setTimeout(() => {
      const now2 = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
      const resp = DEMO_RESPONSES[key];
      setMessages((p) =>
        p.map((m) =>
          m.isTyping
            ? { ...m, text: resp.text, isTyping: false, time: now2, hasAudio: true, responseType: resp.type, file: resp.file }
            : m
        )
      );
    }, 1500);
  }, []);

  const handleSend = useCallback(() => doSend(inputValue), [inputValue, doSend]);

  const handleQuestionSelect = useCallback(
    (q) => {
      setInputValue(q);
      setTimeout(() => doSend(q), 150);
    },
    [doSend]
  );

  const resetChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setInputValue("");
    setHasUserSent(false);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    handleSend,
    handleQuestionSelect,
    hasUserSent,
    activeChat,
    setActiveChat,
    resetChat,
  };
}
