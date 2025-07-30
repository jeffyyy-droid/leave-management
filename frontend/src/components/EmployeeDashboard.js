// src/components/EmployeeDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaves, applyLeave } from "../services/api";
import Navbar from "./Navbar";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  // form state
  const [leaveType, setLeaveType] = useState("Annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // fetched data
  const [leaves, setLeaves] = useState([]);

  // 1) fetchLeaves wrapped in useCallback → safe to put in deps
  const fetchLeaves = useCallback(async () => {
    try {
      const { data } = await getLeaves();
      setLeaves(data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  // 2) run once on mount
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // 3) handleApply also in useCallback
  const handleApply = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await applyLeave({
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
        });
        fetchLeaves();
      } catch (err) {
        console.error("Error applying leave:", err);
      }
    },
    [leaveType, startDate, endDate, fetchLeaves]
  );

  return (
    <div>
      <Navbar />
      <h2>Employee Dashboard</h2>

      <form onSubmit={handleApply}>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option value="Annual">Annual</option>
          <option value="Sick">Sick</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Apply Leave</button>
      </form>

      <h3>My Leave Requests</h3>
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.leave_type} |{" "}
            {new Date(leave.start_date).toLocaleDateString()}–{" "}
            {new Date(leave.end_date).toLocaleDateString()} | {leave.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
