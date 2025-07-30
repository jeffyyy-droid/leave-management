import React from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Leave Management</h1>
      <p>Click below to login</p>
      <button 
        onClick={() => navigate("/login")} 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default IndexPage;
