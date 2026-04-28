import { useState } from "react";
import HistorySidebar from "../components/sidebar/HistorySidebar.jsx";
import ChatContent from "../components/chat/ChatContent.jsx";

export default function FullPageLayout(props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="w-full h-full flex font-['PT_Sans',sans-serif]">
      <div className={`h-full shrink-0 ${sidebarCollapsed ? "w-12" : "w-[260px]"}`}>
        <HistorySidebar
          onNewChat={props.onNewChat}
          onSelectChat={() => {}}
          activeChat="h1"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      <div className="flex-1 h-full flex flex-col" style={{ background: "linear-gradient(180deg, #F5F5F5 0%, #FAFAFA 30%, #FFF 100%)" }}>
        <ChatContent {...props} isCompact={false} showGreeting={true} />
      </div>
    </div>
  );
}
