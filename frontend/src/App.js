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
import IndexPage         from "./components/Index";  // ← Add this import

function App() {
  return (
    <Router>
      <Routes>
        {/* Index page */}
        <Route path="/" element={<IndexPage />} />

        {/* Login screen */}
        <Route path="/login" element={<Login />} />

        {/* Employee and Admin dashboards */}
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager"  element={<ManagerDashboard  />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
