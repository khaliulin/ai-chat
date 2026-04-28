import { useState, useMemo } from "react";
import { CHAT_HISTORY } from "../data/chatHistory.js";

export function useChatHistory() {
  const [chats] = useState(CHAT_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chats, searchQuery]);

  const pinnedChats = useMemo(() => filteredChats.filter((c) => c.pinned), [filteredChats]);

  const groupedChats = useMemo(() => {
    const regular = filteredChats.filter((c) => !c.pinned);
    const groups = {};
    regular.forEach((c) => {
      if (!groups[c.date]) groups[c.date] = [];
      groups[c.date].push(c);
    });
    return groups;
  }, [filteredChats]);

  return {
    filteredChats,
    pinnedChats,
    groupedChats,
    searchQuery,
    setSearchQuery,
    menuOpenId,
    setMenuOpenId,
  };
}
