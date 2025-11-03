import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const responses: Record<string, string> = {
  hello: "Hi there! How can I help you today?",
  hi: "Hello! What can I do for you?",
  help: "I'm here to assist you. You can ask me about features, settings, or general questions.",
  "how are you": "I'm doing great, thank you for asking! How can I assist you?",
  features:
    "You can use the menu to access Chatbot, Favourites, Notifications, and Settings.",
  settings:
    "Click on the Settings icon in the menu to configure your preferences.",
  bye: "Goodbye! Have a great day!",
  thanks: "You're welcome! Let me know if you need anything else.",
  "thank you": "You're welcome! Feel free to ask if you need more help.",
};

const getResponse = (input: string): string => {
  const lowerInput = input.toLowerCase().trim();
  for (const key in responses) {
    if (lowerInput.includes(key)) return responses[key];
  }
  return "I'm not sure how to respond to that. Try asking about features, settings, or say hello!";
};

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // <- pentru back button

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button className="back-button" onClick={() => navigate("/home-map")}>
          <ArrowLeft size={16} />
        </button>
        <h3>Chat Assistant</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <div className="message-content">{msg.text}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
