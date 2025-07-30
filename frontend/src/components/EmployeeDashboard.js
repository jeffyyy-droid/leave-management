// src/components/EmployeeDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaves, applyLeave } from "../services/api";
import Navbar from "./Navbar";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState("Annual");
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [leaves, setLeaves] = useState([]);

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

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleApply = useCallback(
    async (e) => {
      e.preventDefault();
      const [start, end] = selectedDates;
      try {
        await applyLeave({
          leave_type: leaveType,
          start_date: start,
          end_date: end,
        });
        fetchLeaves();
      } catch (err) {
        console.error("Error applying leave:", err);
      }
    },
    [leaveType, selectedDates, fetchLeaves]
  );

  const approvedLeaves = leaves.filter((leave) => leave.status === "approved");
  const pendingLeaves = leaves.filter((leave) => leave.status === "pending");
  const rejectedLeaves = leaves.filter((leave) => leave.status === "rejected");

  return (
    <div>
      <Navbar />
      <div className="employee-dashboard">
        <h2>Employee Dashboard</h2>

        {/* Request for Leave */}
        <form className="leave-form" onSubmit={handleApply}>
          <h3>Request for Leave</h3>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="leave-select"
          >
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
          </select>

          {/* Calendar Interface */}
          <Calendar
            selectRange={true}
            onChange={setSelectedDates}
            value={selectedDates}
            className="custom-calendar"
          />

          {/* Show selected date range */}
          <p className="selected-range">
            Leave from{" "}
            {selectedDates[0].toLocaleDateString()} to{" "}
            {selectedDates[1].toLocaleDateString()}
          </p>

          <button type="submit">Apply Leave</button>
        </form>

        {/* Split Sections */}
        <div className="leave-sections">
          {/* Approved Section */}
          <div className="leave-section approved">
            <h3>Approved</h3>
            {approvedLeaves.length === 0 ? (
              <p>No approved leaves.</p>
            ) : (
              <ul>
                {approvedLeaves.map((leave) => (
                  <li key={leave._id}>
                    {leave.leave_type} |{" "}
                    {new Date(leave.start_date).toLocaleDateString()} –{" "}
                    {new Date(leave.end_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pending Section */}
          <div className="leave-section pending">
            <h3>Pending</h3>
            {pendingLeaves.length === 0 ? (
              <p>No pending leaves.</p>
            ) : (
              <ul>
                {pendingLeaves.map((leave) => (
                  <li key={leave._id}>
                    {leave.leave_type} |{" "}
                    {new Date(leave.start_date).toLocaleDateString()} –{" "}
                    {new Date(leave.end_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rejected Section */}
          <div className="leave-section rejected">
            <h3>Rejected</h3>
            {rejectedLeaves.length === 0 ? (
              <p>No rejected leaves.</p>
            ) : (
              <ul>
                {rejectedLeaves.map((leave) => (
                  <li key={leave._id}>
                    {leave.leave_type} |{" "}
                    {new Date(leave.start_date).toLocaleDateString()} –{" "}
                    {new Date(leave.end_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
