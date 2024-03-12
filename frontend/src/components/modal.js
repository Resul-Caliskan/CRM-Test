import React, { useState } from "react";
import axios from "axios";

const ApprovalModal = ({ email, onClose }) => {
    const [senderEmail, setEmail] = useState("");
    const [senderPassword, setPassword] = useState("");
  
    const handleApprove = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/sendemail`, {
          senderEmail,
          senderPassword,
          recipientEmail: email,
        });
  
        if (response.status === 200) {
          onClose();
        } else {
          console.error("Approval request failed.");
        }
      } catch (error) {
        console.error("Error during approval:", error);
      }
    };
  
    const modalStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.7)",
    };
  
    const contentStyle = {
      background: "#fff",
      padding: "20px",
      width:"20%",
      height:"50%",
      borderRadius: "8px",
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
    };
  
    const closeButtonStyle = {
      position: "relative",
      top: "-10px",
  
      left: "90%", // Adjust the right property as needed
      fontSize: "30px",
      cursor: "pointer",
      color: "red",
    };
  
    const labelStyle = {
      display: "block",
      marginBottom: "8px",
    };
  
    const inputFieldStyle = {
      width: "100%",
      padding: "10px",
      borderRadius:"50px",
      marginBottom: "12px",
      border: "1px solid black",
    };
  
    const sendButtonStyle = {
      background: "#4caf50",
      width:"100%",
      color: "#fff",
      marginTop:"12px",
      padding: "12px 24px",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      fontSize: "16px",
    };
  
    const sendButtonHoverStyle = {
      background: "#45a049",
    };
  
    return (
      <div style={modalStyle}>
        <div style={contentStyle}>
        <span style={closeButtonStyle} onClick={onClose}>
            &times;
          </span>
          <div>
            <label style={labelStyle}>Email:</label>
            <input
              type="text"
              value={senderEmail}
              onChange={(e) => setEmail(e.target.value)}
              style={inputFieldStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              value={senderPassword}
              onChange={(e) => setPassword(e.target.value)}
              style={inputFieldStyle}
            />
          </div>
          <button
            style={Object.assign({}, sendButtonStyle, sendButtonHoverStyle)}
            onClick={handleApprove}
          >
            Gönder
          </button>
        </div>
      </div>
    );
  };
  
  export default ApprovalModal;