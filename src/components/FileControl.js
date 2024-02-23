import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";

import "../fileControl.css";
import axios from "axios";
import { useApp, useAppDispatch } from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";

const FileControl = ({ showModal, onClose }) => {
  const [fileList, setFileList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const states = useApp();

  useEffect(() => {
    fetchUploadedFiles();
    fetchSelectedFiles();
  }, []);

  const fileIcons = {
    pdf: "PictureAsPdfIcon",
    doc: "DescriptionIcon",
    txt: "InsertDriveFileIcon",
    jpg: "ImageIcon",
    png: "ImageIcon",
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  const handleFileSelection = async (filename) => {
    // Check if the file is already selected
    if (!selectedFiles.includes(filename)) {
      // Update the state and then dispatch the action
      setSelectedFiles((prevSelectedFiles) => {
        const updatedSelectedFiles = [...prevSelectedFiles, filename];
        dispatch({
          type: "FILES_SELECTION_SUCCESS",
          payload: updatedSelectedFiles,
        });
        return updatedSelectedFiles;
      });
    } else {
      // File is already selected, uncheck it (remove from selectedFiles)
      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.filter((selectedFile) => selectedFile !== filename)
      );

      // Dispatch the updated state
      dispatch({
        type: "FILES_SELECTION_SUCCESS",
        payload: selectedFiles.filter(
          (selectedFile) => selectedFile !== filename
        ),
      });
    }
  };

  const fetchSelectedFiles = () => {
    setSelectedFiles(states.uploadedFile.selectedFiles);
  };

  const fetchUploadedFiles = async () => {
    try {
      setLoading(true); // to get loader icon
      await dispatch({
        type: "GET_UPLOADED_FILES_REQUEST",
      });
      const response = await axios.get(
        "http://localhost:5000/api/unstructured/get_all_files",
        { params: { active_tab: "unstructured" } }
      );
      const allFiles = response.data.AllFiles;
      console.log("allFiles", allFiles);
      setFileList(allFiles);
      await dispatch({
        type: "GET_UPLOADED_FILES_SUCCESS",
        payload: allFiles,
      });
    } catch (error) {
      console.error("Error fetching files:", error);
      dispatch({
        type: "GET_UPLOADED_FILES_FAILURE",
        payload: error.message,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleDownloadFile = (filename) => {
    const lowerCaseFilename = filename.toLowerCase();
    if (
      lowerCaseFilename.includes(".png") ||
      lowerCaseFilename.includes(".jpg") ||
      lowerCaseFilename.includes(".jpeg")
    ) {
      window.open(
        `https://genaiblobstorage123.blob.core.windows.net/unstructuredatacontainer/dataset/imgs/${filename}`
      );
    } else if (lowerCaseFilename.includes(".pdf") || lowerCaseFilename.includes(".docx")) {
      window.open(
        `https://genaiblobstorage123.blob.core.windows.net/unstructuredatacontainer/dataset/docs/${filename}`
      );
    } else {
      console.error("Unsupported file type");
    }
  };

  const handleRemoveFile = async (filename) => {
    try {
      await dispatch({
        type: "DELETE_UPLOADED_FILE_REQUEST",
      });
      const response = await axios.delete(
        `http://localhost:5000/api/unstructured/remove_file/${filename}`,
        { params: { active_tab: "unstructured" } }
      );
      await dispatch({
        type: "DELETE_UPLOADED_FILE_SUCCESS",
      });
      fetchUploadedFiles();
    } catch (error) {
      console.error("Error removing file:", error);
      dispatch({
        type: "DELETE_UPLOADED_FILE_FAILURE",
        payload: error.message,
      });
    } finally {
      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.filter((selectedFile) => selectedFile !== filename)
      );
    }
  };
  return (
    <div className={`modal ${showModal ? "show" : ""}`}>
      <div className="modal-content">
        <div className="file-list">
          <div>
            <h2>Uploaded Files</h2>
          </div>
          <div className="close-icon">
            <CloseIcon onClick={() => onClose()} />
          </div>
        </div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className="fileNames">
            {fileList.length === 0 ? (
              <p>No files uploaded</p>
            ) : (
              <ul style={{ listStyleType: "none" }}>
                {fileList.map((file, index) => {
                  const isSelected = selectedFiles.includes(file);
                  const extension = getFileExtension(file);
                  const FileIcon = InsertDriveFileIcon;
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <li
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          cursor: "pointer",
                          border: isSelected ? "2px solid darkblue" : "none",
                          backgroundColor: isSelected
                            ? "#bfcaf1"
                            : "transparent",
                        }}
                        onClick={() => handleFileSelection(file)}
                      >
                        <FileIcon style={{ marginRight: "5px" }} />
                        <div style={{ width: "150px", wordWrap: "break-word" }}>
                          {file}
                        </div>
                      </li>
                      <FileDownloadOutlinedIcon
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          fontSize: "20px",
                          margin: "0px 5px",
                        }}
                        onClick={() => handleDownloadFile(file)}
                      />
                      <RemoveIcon
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "20px",
                          margin: "0px 5px",
                        }}
                        onClick={() => handleRemoveFile(file)}
                      />
                    </div>
                  );
                })}
              </ul>
            )}
            {fileList.length === 0 ? null : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  style={{ padding: "10px", marginTop: "10%" }}
                  onClick={() => {
                    onClose();
                  }}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileControl;
