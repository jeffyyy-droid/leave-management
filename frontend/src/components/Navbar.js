// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-section left"></div> {/* Empty space for alignment */}
      <div className="navbar-section center">
        <img src="/geolah.png" alt="Geolah Logo" className="navbar-logo" />
      </div>
      <div className="navbar-section right">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
