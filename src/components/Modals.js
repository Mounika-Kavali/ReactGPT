import React from "react";
import "../fileControl.css";

export default function Modals({ message, onUploadAnyway, onCancel }) {
  const styles = {
    overlay: {
      position: "fixed",
      zIndex: 999,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center", // This will center the modal vertically
      justifyContent: "center", // This will center the modal horizontally
    },
    modal: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "500px",
      maxHeight: "300px",
      overflowY: "auto",
    },
    button: {
      margin: "10px",
      padding: "10px 20px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p>{message}</p>
        <div style={{display:"flex"}}>
          <button style={styles.button} onClick={onUploadAnyway}>
            Upload Anyway
          </button>
          <button style={styles.button} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
