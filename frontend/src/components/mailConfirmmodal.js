import React, { useState } from "react";
import axios from "axios";
import { MdOutlineMail } from "react-icons/md";

const MailConfirmModal = ({ email, onClose, onConfirm }) => {
  const [senderEmail, setEmail] = useState("");
  const [senderPassword, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Yeni eklenen state

  const handleApprove = async () => {
    setIsLoading(true); // İşlem başladığında loading ikonunu göstermek için state'i güncelliyoruz
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/sendemail`,
        {
          recipientEmail: email,
        }
      );

      if (response.status === 200) {
        onConfirm();
        onClose();
      } else {
        console.error("Approval request failed.");
      }
    } catch (error) {
      console.error("Error during approval:", error);
    } finally {
      setIsLoading(false); // İşlem tamamlandığında loading ikonunu kaldırmak için state'i güncelliyoruz
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
    width: "300px",
    height: "300px",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
    display: "flex", // İçeriği ortalamak için
    flexDirection: "column", // İçeriği dikey olarak hizalamak için
    alignItems: "center", // İçeriği dikey eksende ortalamak için
  };

  const closeButtonStyle = {
    position: "relative",
    top: "-20px",
    left: "48%",
    fontSize: "30px",
    cursor: "pointer",
    color: "red",
  };
  const sendButtonStyle = {
    background: "#4caf50",
    width: "70%",
    color: "#fff",
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
        <div style={{ textAlign: "center" }}>
          <MdOutlineMail style={{ fontSize: "64px", color: "limegreen" }} />
        </div>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Talebi onayladığınıza dair mail göndermek için gönder butonuna
          tıklayınız.
        </p>
        <button
          style={Object.assign({}, sendButtonStyle, sendButtonHoverStyle)}
          onClick={handleApprove}
          disabled={isLoading} // İşlem sırasında butonu devre dışı bırakmak için
        >
          {isLoading ? "Gönderiliyor..." : "Gönder"}{" "}
          {/* Buton metnini işlem durumuna göre ayarlıyoruz */}
        </button>
      </div>
    </div>
  );
};

export default MailConfirmModal;
