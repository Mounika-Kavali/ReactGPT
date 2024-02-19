import React, { useState, useEffect } from "react";
import { AttachFile as AttachmentIcon } from "@material-ui/icons";
import axios from "axios";
import { useApp, useAppDispatch } from "../context/AppContext";
import Modals from "./Modals";

const FileAttach = () => {
  const dispatch = useAppDispatch();
  const states = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalMessage, setUploadModalMessage] = useState("");
  const [verifyFiles, setVerifyFiles] = useState([]);

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
      const apiResponse = response.data;
      console.log("Upload response:", response.data);
      if (apiResponse[0].status === "uploaded doc contains sensitive info") {
        setShowUploadModal(true);
        setUploadModalMessage(
          `The document "${apiResponse[0].filenames[0]}" contains sensitive information.`
        );
        setVerifyFiles(apiResponse[0].filenames);
      }
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

  const handleUploadAnyway = () => {
    setShowUploadModal(false);
  };

  const handleUploadCancel = async () => {
    setShowUploadModal(false);
    // Call remove API or handle cancellation
    console.log("verifyFiles in handleUploadCancel", verifyFiles);
    const removePromises = verifyFiles.map((filename) => {
      return axios.delete(
        `http://localhost:5000/api/unstructured/remove_file/${filename}`,
        {
          params: { active_tab: "unstructured" },
        }
      );
    });
    try {
      // Wait for all file removals to complete
      await Promise.all(removePromises);
      console.log("All files removed successfully.");

      // Optionally reset verifyFiles or handle other post-removal logic here
      setVerifyFiles([]);
    } catch (error) {
      console.error("Error removing files:", error);
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

      {showUploadModal && (
        <Modals
          message={uploadModalMessage}
          onUploadAnyway={handleUploadAnyway}
          onCancel={handleUploadCancel}
        />
      )}
    </div>
  );
};

export default FileAttach;
