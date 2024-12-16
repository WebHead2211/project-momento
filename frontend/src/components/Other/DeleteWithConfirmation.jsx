// ConfirmationPopup.js
import React, { useState } from "react";
import "../../styles/DeleteWithConfirmation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmationPopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      // style={styles.overlay}
      className="overlay"
    >
      <div style={styles.popup}>
        <p style={styles.message}>Are you sure you want to delete this post?</p>
        <div style={styles.buttonContainer}>
          <button
            //   style={styles.confirmButton}
            onClick={onConfirm}
            className="btn-primary btn"
          >
            Yes
          </button>
          <button
            //   style={styles.cancelButton}
            onClick={onClose}
            className="btn-secondary btn"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteWithConfirmation = ({ id }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setPopupOpen(true);
  };

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setPopupOpen(false);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    await axios.delete(`/api/v1/posts/deletePost/${id}`);
    setPopupOpen(false);
    navigate(0);
  };

  return (
    <div className="delete">
      <button
        className="btn-delete"
        //   style={styles.deleteButton}
        onClick={(e) => {
          handleDeleteClick(e);
        }}
      >
        <i className="fa-solid fa-trash"></i>
      </button>
      <ConfirmationPopup
        isOpen={isPopupOpen}
        onClose={(e) => {
          handleClosePopup(e);
        }}
        onConfirm={(e) => {
          handleConfirmDelete(e);
        }}
      />
    </div>
  );
};

const styles = {
  popup: {
    backgroundColor: "black",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "300px",
  },
  message: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: "10",
  },
};

export default DeleteWithConfirmation;
