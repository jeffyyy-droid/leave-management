// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Login             from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import ManagerDashboard  from "./components/ManagerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login screen */}
        <Route path="/login" element={<Login />} />

        {/* Employee and Admin dashboards */}
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager"  element={<ManagerDashboard  />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// ← Ensure this line is present:
export default App;
