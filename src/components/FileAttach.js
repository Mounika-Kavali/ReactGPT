import React, { useState, useEffect } from "react";
import { AttachFile as AttachmentIcon } from "@material-ui/icons";
import axios from "axios";
import { useApp, useAppDispatch } from "../context/AppContext";

const FileAttach = () => {
  const dispatch = useAppDispatch();
  const states = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalMessage, setuploadModalMessage] = useState('');

  const handleFileUpload = async (e) => {
    const uploadedFiles = e.target.files;
    const fileData = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const filename = file.name;
      fileData.push({ file, filename });
    }

    const formData = new FormData();

    fileData.forEach(({ file, filename }) => {
      formData.append("files", file);
      formData.append("filenames", filename);
    });

    try {
      await dispatch({
        type: "UPLOAD_FILE_REQUEST",
      });

      const response = await axios.post(
        `http://localhost:5000/api/unstructured/upload`,
        formData,
        {
          params: { active_tab: "unstructured" },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload response:", response.data);
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
        multiple
        onChange={handleFileUpload}
        onClick={(e) => (e.target.value = null)} // because file caches the selected file
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileAttach;
