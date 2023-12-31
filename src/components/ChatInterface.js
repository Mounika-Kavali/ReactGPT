// ChatInterface.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SendIcon from "@material-ui/icons/Send";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Microphone from "./Microphone";
import FileAttach from "./FileAttach";
import LoadingSpinner from "./LoadingSpinner";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef(null);
  const [scrollBottomArrow, setScrollBottomArrow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.removeEventListener(
          "scroll",
          handleScroll
        );
      }
    };
  }, []);

  const handleScroll = () => {
    if (
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollHeight -
        messagesContainerRef.current.scrollTop ===
        messagesContainerRef.current.clientHeight
    ) {
      setScrollBottomArrow(false);
    } else {
      setScrollBottomArrow(true);
    }
  };

  const scrollToBottom = () => {
    if (scrollBottomArrow) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    setScrollBottomArrow(!scrollBottomArrow);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default behavior (submitting the form or adding a newline)
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    try {
      setLoading(true); // to get loader
      const response = await fetch("http://localhost:5000/generate_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          user_query: inputText,
        }),
      });

      const data = await response.json();

      setMessages([
        ...messages,
        {
          receiver: "user",
          request: inputText,
          response: data.response,
          sender: "assistant",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setLoading(false);
    }

    setInputText("");
  };

  const handleSpeechResult = (text) => {
    setInputText(text);
  };

  return (
    <div className="chat-container">
      <div className="chat-input">
        <div className="textarea-wrapper">
          <textarea
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            rows={Math.min(inputText.split("\n").length + 1, 4)} // Set the initial number of rows to the number of lines in the text up to a maximum of 4
            onKeyDown={handleKeyPress}
          />
          <div className="file-icon">
            <FileAttach />
          </div>
          <div className="mic-icon">
            <Microphone onSpeechResult={handleSpeechResult} />
          </div>
        </div>

        <button onClick={handleSendMessage}>
          {loading ? <LoadingSpinner/> : <SendIcon />}
        </button>
      </div>
      <div className="chat-messages" ref={messagesContainerRef}>
        {console.log("messages", messages)}
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`message ${message.receiver}`}
              style={{
                fontFamily: "sans-serif",
                fontSize: "medium",
                whiteSpace: "pre-line", // preserve both spaces and line breaks in the rendered text.
              }}
            >
              <div style={{ minHeight: "10px" }}>{message.request}</div>
            </div>
            <div
              className={`message ${message.sender}`}
              style={{
                fontFamily: "sans-serif",
                fontSize: "medium",
              }}
            >
              {message.response.includes("```") ? (
                <div
                  style={{
                    backgroundColor: "#575756",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    whiteSpace: "pre", // to follow indentation
                  }}
                >
                  {message.response.split("```")[1]}
                </div>
              ) : (
                message.response
                  .split("\n")
                  .map((line, i) => <div key={i}>{line}</div>)
              )}
            </div>
          </div>
        ))}
        {scrollBottomArrow && (
          <div className="scroll-to-bottom" onClick={scrollToBottom}>
            <ArrowDownwardIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
