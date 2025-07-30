// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");  // ensure this matches your login route
  };

  return (
    <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
      <h3>Leave Management System</h3>
      <button onClick={logout} style={{ float: "right", color: "#000" }}>
        Logout
      </button>
    </nav>
  );
}
