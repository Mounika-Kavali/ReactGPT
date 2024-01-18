import React, { useState, useEffect } from "react";
import { AttachFile as AttachmentIcon } from "@material-ui/icons";
import axios from "axios";
import { useApp, useAppDispatch } from "../context/AppContext";

const FileAttach = () => {
  const dispatch = useAppDispatch();
  const states = useApp();

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    const filename = uploadedFile.name;
    const filepath = e.target.value; // doesnot provide full path

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("filename", filename);

    try {
      await dispatch({
        type: "UPLOAD_FILE_REQUEST",
      });
      const response = await axios.post(
        `http://localhost:5000/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: { filename }
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
        onClick={(e) => (e.target.value = null)}  // because file caches the selected file
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileAttach;
