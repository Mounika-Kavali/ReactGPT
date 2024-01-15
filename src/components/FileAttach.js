import React, { useState, useEffect } from "react";
import { AttachFile as AttachmentIcon } from "@material-ui/icons";
import axios from "axios";
import { useApp, useAppDispatch } from "../context/AppContext";

const FileAttach = () => {
  const dispatch = useAppDispatch();
  const states = useApp();

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    const filename = selectedFile.name;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await dispatch({
        type: "UPLOAD_FILE_REQUEST",
      });
      const response = await axios.post(
        `http://localhost:5000/upload/${filename}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await dispatch({
        type: "UPLOAD_FILE_SUCCESS",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      dispatch({
        type: "UPLOAD_FILE_FAILURE",
        payload: error.message,
      });
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="fileInput">
          <AttachmentIcon className="file-attachment-icon" />
        </label>
      </div>
      {/* Input for file upload */}
      <input
        type="file"
        id="fileInput"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileAttach;
