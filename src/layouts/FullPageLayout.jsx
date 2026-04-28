import { useState } from "react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";

export default function FullPageLayout(props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "'PT Sans', sans-serif" }}>
      <div style={{ width: sidebarCollapsed ? 48 : 260, height: "100%", flexShrink: 0 }}>
        <HistorySidebar
          onNewChat={props.onNewChat}
          onSelectChat={() => {}}
          activeChat="h1"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      <div style={{
        flex: 1, height: "100%",
        background: "linear-gradient(180deg, #F5F5F5 0%, #FAFAFA 30%, #FFF 100%)",
        display: "flex", flexDirection: "column",
      }}>
        <ChatContent {...props} isCompact={false} showGreeting={true} />
      </div>
    </div>
  );
}
