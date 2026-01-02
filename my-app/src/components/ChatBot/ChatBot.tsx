import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, MapPin, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";
import { useTranslation } from "react-i18next";
import { getLocalizedCake } from "../../utils/cakeUtils";

type ChatStep = "ASK_CRAVING" | "ASK_ALLERGIES" | "SHOW_RESULTS";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  recommendations?: any[];
}

export const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState<ChatStep>("ASK_CRAVING");
  const [userCraving, setUserCraving] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t("chatbot_welcome"),
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg: Message = {
      id: Date.now(),
      text: userText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    if (step === "SHOW_RESULTS") {
      setUserCraving(userText);
      setStep("ASK_ALLERGIES");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: t("chatbot_ask_allergies"),
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }, 500);
      return;
    }

    if (step === "ASK_CRAVING") {
      setUserCraving(userText);
      setStep("ASK_ALLERGIES");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: t("chatbot_ask_allergies"),
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }, 500);
    } else if (step === "ASK_ALLERGIES") {
      setIsLoading(true);
      const allergens =
        userText.toLowerCase().includes("nu") && userText.length < 5
          ? ""
          : userText;

      try {
        const response = await fetch("http://127.0.0.1:8000/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: userCraving,
            allergens: allergens,
            top_k: 3,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Eroare necunoscută");
        }

        const results = data.results || [];

        let botText =
          results.length > 0
            ? t("chatbot_results_found")
            : t("chatbot_no_results");

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: botText,
            sender: "bot",
            timestamp: new Date(),
            recommendations: results,
          },
        ]);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              text: t("chatbot_try_again_hint"),
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }, 1000);

        setStep("SHOW_RESULTS");
      } catch (e: any) {
        console.error(e);
        let errorMsg = t("chatbot_error_generic");

        if (e.message && e.message.includes("AI-ul este gol")) {
          errorMsg = t("chatbot_error_sync");
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: errorMsg,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        setStep("ASK_CRAVING");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRestart = () => {
    setStep("ASK_CRAVING");
    setUserCraving("");
    setMessages([
      {
        id: Date.now(),
        text: t("chatbot_restart"),
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  const handleGoToLocation = (cakeId: number) => {
    navigate("/home-map", { state: { targetCakeId: cakeId } });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button className="back-button" onClick={() => navigate("/home-map")}>
          <ArrowLeft size={20} />
        </button>
        <h3>CraveBuddy AI</h3>
        {step === "SHOW_RESULTS" && (
          <button className="restart-header-btn" onClick={handleRestart}>
            <RotateCcw size={20} />
          </button>
        )}
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div
              className={`message ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <div className="message-content">{msg.text}</div>
            </div>
            {msg.recommendations && (
              <div className="recommendations-list">
                {msg.recommendations.map((cake: any) => {
                  const displayCake = getLocalizedCake(cake, i18n.language);
                  return (
                    <div key={cake.id} className="cake-card">
                      <div className="cake-info">
                        <h4>{displayCake.name}</h4>
                        <span className="cake-score">
                          {Math.round(cake.score * 100)}% Match
                        </span>
                      </div>
                      <p className="cake-desc">{displayCake.ingredients}</p>
                      <button
                        className="find-location-btn"
                        onClick={() => handleGoToLocation(cake.id)}
                      >
                        <MapPin size={16} /> {t("find_location")}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={
            step === "ASK_ALLERGIES"
              ? t("placeholder_allergies")
              : t("placeholder_cravings")
          }
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
