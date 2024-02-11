// ChatInterface.js
import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import TuneIcon from "@mui/icons-material/Tune";
import Microphone from "./Microphone";
import FileAttach from "./FileAttach";
import { Switch } from "@material-ui/core";
import LoadingSpinner from "./LoadingSpinner";
import { AppContext, useApp, useAppDispatch } from "../context/AppContext";
import axios from "axios";
import FileControl from "./FileControl";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [webAccess, setWebAccess] = useState(false);

  //   const { state, dispatch } = useContext(AppContext);
  const dispatch = useAppDispatch();
  const states = useApp();

  useEffect(() => {
    // Scroll to the bottom of the chat msgs container
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]);

  const handleTextAreaFocus = () => {
    setIsTextareaFocused(true);
  };

  const handleTextAreaBlur = () => {
    setIsTextareaFocused(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default behavior (submitting the form or adding a newline)
      if(webAccess){
        handleSwitchOn();
      }else{
      handleSendMessage();
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;
    setLoading(true); // to get loader icon
    await dispatch({
      type: "GENERATE_RESPONSE_REQUEST",
    });
    try {
      let selected_files = [];
      let get_all_files = [];
      let inputFiles = [];

      selected_files = states.uploadedFile.selectedFiles || [];
      get_all_files = states.uploadedFile.fileList || [];
      // const all_pdf_files = get_all_files.filter(file => file.toLowerCase().endsWith('.pdf'));

      inputFiles = selected_files.length > 0 ? selected_files : [];

      const res = await axios.post(
        "http://localhost:5000/api/unstructured/generate_response",
        {
          user_query: inputText,
          fileList: inputFiles,
        }
      );
      const data = res.data.response;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          Human: "user",
          request: inputText,
          response: data,
          AI: "assistant",
        },
      ]);
      await dispatch({
        type: "GENERATE_RESPONSE_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "GENERATE_RESPONSE_FAILURE",
        payload: error.message,
      });
    } finally {
      setLoading(false); // Reset loading state
      setInputText("");
    }
  };

  const handleSpeechResult = (text) => {
    setInputText(text);
  };

  const handleFileModalOpen = () => {
    setFileModalOpen(true);
  };

  const handleFileModalClose = () => {
    setFileModalOpen(false);
  };

  const handleSwitchOn = async () => {
    if (inputText.trim() === "") return;
    try {
      const parts = inputText.split("\n");
      const webUrls = parts[0].split(",").map((url) => url.trim());
      const webQuery = parts[1].trim();

      const res = await axios.post(
        "http://localhost:5000/api/unstructured/web_response",
        {
          url_query: webQuery,
          web_urls: webUrls,
        }
      );
      const data = res.data.response;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          Human: "user",
          request: inputText,
          response: data,
          AI: "assistant",
        },
      ]);
    } catch (error) {
      console.log("Error occurred while generating response:", error);
    }
  };

  return (
    <>
      <div className="header">
        <div>
          <img
            src="https://www.sparity.com/wp-content/uploads/2022/09/sparitylogo-color.png"
            width="110"
            height="50"
            alt="sparity-logo"
          />
        </div>

        <div className="Heading">
          <div>
            <h2>Document Query-Response System</h2>
          </div>
          <div>
            {isTextareaFocused ? (
              <div className="bot-image-container">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/13514/13514207.png"
                  width="70"
                  height="70"
                  alt="botThinking"
                  title="botThinking"
                  className="img-small"
                />
              </div>
            ) : (
              <div className="bot-image-container">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/13514/13514160.png"
                  width="70"
                  height="70"
                  alt="botIdea"
                  title="botIdea"
                />
              </div>
            )}
          </div>
        </div>

        <div className="tuneIcon">
          <TuneIcon className="tune-icon" onClick={handleFileModalOpen} />
        </div>
      </div>

      {fileModalOpen && (
        <FileControl
          showModal={handleFileModalOpen}
          onClose={handleFileModalClose}
        />
      )}

      <div className="chat-container">
        <div id="chat-messages" className="chat-messages">
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`message ${message.Human}`}
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "medium",
                  whiteSpace: "pre-line", // preserve both spaces and line breaks(\n) in the rendered text.
                  // maxWidth: message.request.length > 50 ? "400px" : "200px",
                }}
              >
                <div
                  style={{
                    fontFamily: "bold",
                    fontSize: "14px",
                    textDecorationLine: "underline",
                    color: "#c4910f",
                  }}
                >
                  You
                </div>
                <div style={{ minHeight: "14px" }}>{message.request}</div>
              </div>
              <div
                className={`message ${message.AI}`}
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "medium",
                  whiteSpace: "pre-line",
                }}
              >
                <div
                  style={{
                    fontFamily: "bold",
                    fontSize: "14px",
                    textDecorationLine: "underline",
                    color: "#bc3153",
                  }}
                >
                  Assistant
                </div>
                <div>{message.response}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <Switch
            checked={webAccess}
            onChange={(event) => {
              setWebAccess(event.target.checked);
              
            }}
            color="primary"
            name="webAccessToggle"
            inputProps={{ "aria-label": "Web access toggle" }}
          />
          <div className="textarea-wrapper">
            <textarea
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                webAccess
                  ? "paste web URL\nhere enter your query... "
                  : "Ask your question..."
              }
              rows={Math.min(inputText.split("\n").length + 1, 4)} // Set the initial number of rows to the number of lines in the text up to a maximum of 4
              onKeyDown={handleKeyPress}
              onFocus={handleTextAreaFocus}
              onBlur={handleTextAreaBlur}
            />
            <div className="file-icon">
              <FileAttach />
            </div>
            <div className="mic-icon">
              <Microphone onSpeechResult={handleSpeechResult} />
            </div>
          </div>

          <button onClick={webAccess?handleSwitchOn:handleSendMessage}>
            {loading ? <LoadingSpinner /> : <SendIcon />}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatbotUI;
