import React from "react";
import "./Button.css";

const Button = ({ label, active, onClick }) => {
  return (
    <button
      className={`top-btn ${active ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
};

export default Button;
