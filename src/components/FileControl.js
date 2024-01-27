import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";

import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";

import "../fileControl.css";
import axios from "axios";
import { useApp, useAppDispatch } from "../context/AppContext";

const FileControl = ({ showModal, onClose }) => {
  const [fileList, setFileList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const dispatch = useAppDispatch();
  const states = useApp();

  useEffect(() => {
    console.log("useEffect");
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
      await dispatch({
        type: "GET_UPLOADED_FILES_REQUEST",
      });
      const response = await axios.get(
        "http://localhost:5000/api/unstructured/get_all_files"
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
    }
  };

  const handleRemoveFile = async (filename) => {
    try {
      await dispatch({
        type: "DELETE_UPLOADED_FILE_REQUEST",
      });
      const response = await axios.delete(
        `http://localhost:5000/api/unstructured/remove_file/${filename}`
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
        <div className="fileNames">
          {fileList.length === 0 ? (
            <p>No files uploaded</p>
          ) : (
            <ul style={{ listStyleType: "none" }}>
              {fileList.map((file, index) => {
                // {console.log("selectedFiles",selectedFiles)}
                const isSelected = selectedFiles.includes(file);
                const extension = getFileExtension(file);
                //   const FileIcon = fileIcons[extension] || InsertDriveFileIcon; //for diff icons based on extension but invalid in explorer browser
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
                        cursor: "pointer",
                        border: isSelected ? "2px solid darkblue" : "none",
                        backgroundColor: isSelected ? "#bfcaf1" : "transparent",
                      }}
                      onClick={() => handleFileSelection(file)}
                    >
                      <FileIcon style={{ marginRight: "5px" }} />
                      {file}
                    </li>
                    <RemoveIcon
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "20px",
                        marginLeft: "5px",
                      }}
                      onClick={() => handleRemoveFile(file)}
                    />
                  </div>
                );
              })}
            </ul>
          )}
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
        </div>
      </div>
    </div>
  );
};

export default FileControl;
