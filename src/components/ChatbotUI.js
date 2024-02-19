// ChatInterface.js
import React, { useState, useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import TuneIcon from "@mui/icons-material/Tune";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";

import Microphone from "./Microphone";
import FileAttach from "./FileAttach";
import { Switch } from "@material-ui/core";
import LoadingSpinner from "./LoadingSpinner";
import { AppContext, useApp, useAppDispatch } from "../context/AppContext";
import axios from "axios";
import FileControl from "./FileControl";
import jsPDF from "jspdf";

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

  const downloadMessageAsPDF = (message, index) => {
    const pdf = new jsPDF();

    const drawBorder = () => {
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.rect(
        margins.left,
        margins.top,
        pdf.internal.pageSize.getWidth() - margins.left - margins.right,
        pdf.internal.pageSize.getHeight() - margins.top - margins.bottom
      );
    };

    const margins = {
      top: 25,
      bottom: 25,
      left: 10,
      right: 10,
    };

    // Additional gap between the border and the text
    const textGap = 5;
    const pageWidth =
      pdf.internal.pageSize.getWidth() -
      margins.left -
      margins.right -
      2 * textGap;
    let yPos = margins.top;

    // Initially draw border for the first page
    drawBorder();
    const lines = message.response.split("\n");
    lines.forEach((line) => {
      let isHeading = false;
      let fontSize = 12;
      if (line.startsWith("**") && line.endsWith("**")) {
        // Simple way to identify headings
        isHeading = true;
        fontSize = 16;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(fontSize); // Larger size for headings
        line = line.substring(2, line.length - 2); // Remove markers
        yPos += 5; // Additional space before heading
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSize); // Smaller size for regular content
      }

      const splitText = pdf.splitTextToSize(line, pageWidth);
      splitText.forEach((textLine) => {
        if (
          yPos + fontSize * 0.5 >
          pdf.internal.pageSize.getHeight() - margins.bottom
        ) {
          pdf.addPage();
          yPos = margins.top;
          drawBorder(); // Draw border for the new page
        }
        pdf.text(textLine, margins.left + textGap, yPos + textGap);
        yPos += fontSize * 0.5;
      });
    });

    drawBorder();

    pdf.save(`message_${index + 1}.pdf`);
  };

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
      let webUrls = [];
      let webQuery = "";

      selected_files = states.uploadedFile.selectedFiles || [];
      get_all_files = states.uploadedFile.fileList || [];
      inputFiles = selected_files.length > 0 ? selected_files : [];

      if (webAccess) {
        const parts = inputText.split("\n");
        webUrls = parts[0]?.split(",").map((url) => url.trim());
        webQuery = parts[1]?.trim();
      }

      const res = await axios.post(
        "http://localhost:5000/api/unstructured/get_response",
        {
          user_query: inputText,
          fileList: inputFiles,
          url_query: webQuery,
          web_urls: webUrls,
          doc_scraping: !webAccess,
          web_scraping: webAccess,
          active_tab: "unstructured"
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
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Assistant</div>
                  <div style={{ cursor: "pointer" }}>
                    <DownloadForOfflineOutlinedIcon
                      onClick={() => downloadMessageAsPDF(message, index)}
                    />
                  </div>
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

          <button onClick={handleSendMessage}>
            {loading ? <LoadingSpinner /> : <SendIcon />}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatbotUI;
