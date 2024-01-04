import React, { useState } from "react";
import { AttachFile as AttachmentIcon ,Clear as ClearIcon} from "@material-ui/icons";
import axios from "axios";

const FileAttach = () => {
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Send the file to the backend Python server using axios
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response",response)
      // Handle the response, for example, set the uploaded file name
      setUploadedFileName(response.data.fileName);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleRemoveFile = async() => {
    try {
      // Make a DELETE request to the Flask API endpoint
      const response = await axios.delete(`http://localhost:5000/remove_file/${uploadedFileName}`);

      // Handle the response message
    } catch (error) {
      console.error("Error removing file:", error);
    }
    setUploadedFileName("");
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
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Display the uploaded file name */}
      {uploadedFileName && (
        <div
          style={{
            display:"flex",
            width: "70%",
            fontSize: "10px",
            fontWeight: "bold",
            color: "#e47834",
          }}
        >
          {uploadedFileName}
          <ClearIcon
            style={{
              cursor: "pointer",
              color: "red",
              fontSize: "16px",

            }}
            onClick={handleRemoveFile}
          />
        </div>
      )}
      
    </div>
  );
};

export default FileAttach;
