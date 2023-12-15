// ChatInterface.js
import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Microphone from "./Microphone";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef(null);
  const [scrollBottomArrow, setScrollBottomArrow] = useState(false);

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

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    setMessages([...messages, { text: inputText, sender: "user" }]);
    // You can make an API request here to ChatGPT and update the state with the response
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
          <div className="mic-icon">
            <Microphone onSpeechResult={handleSpeechResult} />
          </div>
        </div>

        <button onClick={handleSendMessage}>
          <SendIcon />
        </button>
      </div>
      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
            style={{
              fontFamily: "sans-serif",
              fontSize: "medium",
            }}
          >
            {message.text.split("\n").map((line, i) => (
              <div key={i} style={{ minHeight: "10px" }}>
                {line}
              </div>
            ))}
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
