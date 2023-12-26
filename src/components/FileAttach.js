import React, { useState } from "react";
import { AttachFile as AttachmentIcon } from "@material-ui/icons";
import axios from "axios";

const FileAttach = () => {
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    // For simplicity, let's just set the file name on successful upload.
    setUploadedFileName(selectedFile.name);
    const apiKey = "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";

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/files",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: selectedFile.name }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      console.log("Response ", response);
    } catch (error) {
      console.error("File upload Error:", error.message);
    }
  };

  return (
    <div>
      {/* File Attachment */}
      <div className="file-attachment-icon">
        <label htmlFor="fileInput">
          <AttachmentIcon />
        </label>
      </div>
      {/* Input for file upload */}
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Display the uploaded file name */}
      {uploadedFileName && (
        <div
          style={{
            width: "70%",
            fontSize: "10px",
            fontWeight: "bold",
            color: "#e47834",
          }}
        >
          {uploadedFileName}
        </div>
      )}
    </div>
  );
};

export default FileAttach;
