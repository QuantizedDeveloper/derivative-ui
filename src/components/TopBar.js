import React, { useEffect, useState } from "react";
import "./TopBar.css";
import Button from "./Button";
import { FaFlask } from "react-icons/fa";
import Spinner from "./Spinner";

const TopBar = ({ selected, onSelect, loading }) => {
  const buttons = ["images", "search", "websites", "social", "videos", "studies", "shop", "news"];
  const [theme, setTheme] = useState("light");

  // Load stored theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Toggle theme on flask click
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <>
      <div
        className="flask-fixed"
        onClick={toggleTheme}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{ cursor: "pointer" }}
      >
        <FaFlask className={`flask-icon ${loading ? "pulse" : ""}`} />
        {loading && <Spinner small />}
      </div>

      <nav className="tabs-fixed" aria-label="Main tabs">
        <div className="tabs-inner">
          {buttons.map((b) => (
            <Button
              key={b}
              label={b}
              active={selected === b}
              onClick={() => onSelect(b)}
            />
          ))}
        </div>
      </nav>
    </>
  );
};

export default TopBar;
