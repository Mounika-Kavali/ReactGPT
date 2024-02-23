// ChatInterface.js
import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import TuneIcon from "@mui/icons-material/Tune";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import Microphone from "./Microphone";
import FileAttach from "./FileAttach";
import LoadingSpinner from "./LoadingSpinner";
import { AppContext, useApp, useAppDispatch } from "../context/AppContext";
import axios from "axios";
import FileControl from "./FileControl";

const InteractiveBotUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [matchedImgs, setMatchedImgs] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);

  //   const { state, dispatch } = useContext(AppContext);
  const dispatch = useAppDispatch();
  const states = useApp();

  const handleTextAreaFocus = () => {
    setIsTextareaFocused(true);
  };

  const handleTextAreaBlur = () => {
    setIsTextareaFocused(false);
  };

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

      inputFiles = selected_files.length > 0 ? selected_files : [];
      let res;
      if (threadId) {
        //CONTINUE CONVERSATION
        res = await axios.post(
          "http://localhost:5000/api/interactive_unstructured/continue-chat",
          {
            user_query: inputText,
            fileList: inputFiles,
            chat_thread_id: threadId,
          }
        );
      } else {
        //START NEW CONVERSATION
        res = await axios.post(
          "http://localhost:5000/api/interactive_unstructured/start-chat",
          {
            user_query: inputText,
            fileList: inputFiles,
            chat_thread_id: threadId,
          }
        );
      }
      const asst_data = res.data.assistant_res;
      setThreadId(res.data.chat_thread_id);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          Human: "user",
          request: inputText,
          response: asst_data,
          AI: "assistant",
        },
      ]);
      setMatchedImgs(res.data.matched_images);
      setSelectedFile(states.uploadedFile.selectedFiles);
      await dispatch({
        type: "GENERATE_RESPONSE_SUCCESS",
        payload: asst_data,
      });
    } catch (error) {
      dispatch({
        type: "GENERATE_RESPONSE_FAILURE",
        payload: error.message,
      });
    } finally {
      setLoading(false); // Reset loading state
      //   setInputText("");
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

  const handleStopConversation = () => {
    setThreadId("");
    console.log("conversation thread is cleared",threadId)
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
            <h2>Interactive Query-Response System</h2>
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

      <div
        className="chat-container"
        style={{
          backgroundImage: `url("./assets/images/chat_wallpaper.webp")`,
        }}
      >
        <div className="chat-input">
          <div className="textarea-wrapper">
            <textarea
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your question..."
              rows={Math.min(inputText.split("\n").length + 1, 4)}
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
            {threadId && (
              <div className="stop-icon">
                <StopCircleOutlinedIcon onClick={handleStopConversation} />
              </div>
            )}
          </div>

          <button
            onClick={() => {
              handleSendMessage();
            }}
          >
            {loading ? <LoadingSpinner /> : <SendIcon />}
          </button>
        </div>

        <div id="chat-messages" className="chat-messages">
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`message ${message.Human}`}
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "medium",
                  whiteSpace: "pre-line",
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
          <div style={{ width: "100%" }}>
            {matchedImgs.map((imgUrl, index) => (
              <img
                key={index}
                src={`https://genaiblobstorage123.blob.core.windows.net/unstructuredatacontainer/dataset/extracted-imgs/${selectedFile}/${imgUrl}`}
                alt="Matching images to the response"
                style={{ width: "100%", maxWidth: "500px", padding: "10px" }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractiveBotUI;
