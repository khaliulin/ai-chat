import MessageBubble from "../chat/MessageBubble.jsx";

export default function FeedMessage({ message, isCompact }) {
  return (
    <div className="feed-message">
      <MessageBubble message={message} isCompact={isCompact} />
    </div>
  );
}
