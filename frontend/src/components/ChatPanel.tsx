import React from "react";
import ChatInterface from "./ChatInterface";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSend: (msg: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSend }) => (
  <div className="chat-panel">
    <ChatInterface messages={messages} onSend={onSend} />
  </div>
);

export default ChatPanel;