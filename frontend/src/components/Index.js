// src/components/IndexPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./IndexPage.css";

const IndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="index-page">
      <div className="index-content">
        <img src="/geolah.png" alt="Geolah Logo" className="index-logo" />
        <h1 className="index-title">Welcome to Leave Management</h1>
        <br></br>
        <button onClick={() => navigate("/login")} className="index-button">
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
