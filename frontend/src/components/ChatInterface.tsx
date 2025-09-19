import React, { useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (msg: string) => void;
}
// ChatInterface: displays a chat window with messages and an input box
const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {// Only send non-empty messages
      onSend(input);
      setInput("");// Clear input after sending
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 24,borderRadius: 8 }}>
      <div style={{ height: 300, overflowY: "auto"}}>
        {messages.map((msg, idx) => (
          // // Align based on sender
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}> 
            <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)} // Update state on input change
        onKeyDown={e => e.key === "Enter" && handleSend()} // Send message when pressing Enter
        placeholder="Type your prompt..."
        style={{ width: "80%" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInterface;