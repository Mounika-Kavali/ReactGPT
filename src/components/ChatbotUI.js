// ChatInterface.js
import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import TuneIcon from "@mui/icons-material/Tune";
import Microphone from "./Microphone";
import FileAttach from "./FileAttach";
import LoadingSpinner from "./LoadingSpinner";
import { AppContext, useApp, useAppDispatch } from "../context/AppContext";
import axios from "axios";
import FileControl from "./FileControl";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents the default behavior (submitting the form or adding a newline)
      handleSendMessage();
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
  
      inputFiles = selected_files.length > 0 ? selected_files : get_all_files;

      const res = await axios.post("http://localhost:5000/generate_response", {
        user_query: inputText,
        fileList: inputFiles,
      });
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
      setInputText("")
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

  return (
    <>
      <div className="Heading">
        <h2>
          <u>
            <center>Document Query-Response System</center>
          </u>
        </h2>
      </div>
      <div className="tuneIcon"  >
        <TuneIcon className="tune-icon" onClick={handleFileModalOpen}/>
      </div>

      {fileModalOpen && <FileControl showModal={handleFileModalOpen} onClose={handleFileModalClose}/>}

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
                }}
              >
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
                <div>{message.response}</div>
              </div>
            </div>
          ))}
        </div>

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
            {loading ? <LoadingSpinner /> : <SendIcon />}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatbotUI;
