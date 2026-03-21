import React from "react";
import ChatInterface from "./ChatInterface";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSend: (msg: string) => void;
  isLoading?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSend, isLoading }) => (
  <div className="chat-panel">
    <ChatInterface messages={messages} onSend={onSend} isLoading={isLoading} />
  </div>
);

export default ChatPanel;