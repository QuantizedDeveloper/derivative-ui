import React from "react";
import "./Spinner.css";

const Spinner = ({ small }) => {
  return <div className={`spinner-small ${small ? "small" : ""}`} />;
};

export default Spinner;
