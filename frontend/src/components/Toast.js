"use client";
import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type || "success"}`}>
      <div className="toast-content">
        {type === "error" ? (
          <FaExclamationCircle className="toast-icon" />
        ) : (
          <FaCheckCircle className="toast-icon" />
        )}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}
