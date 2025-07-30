// src/components/ManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import { getLeaves, updateLeaveStatus } from "../services/api";
import Navbar from "./Navbar";

export default function ManagerDashboard() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const { data } = await getLeaves();
    setLeaves(data);
  };

  const handleUpdate = async (id, status) => {
    await updateLeaveStatus(id, status);
    fetchLeaves();
  };

  return (
    <div>
      <Navbar />
      <h2>Manager Dashboard</h2>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave._id}>
              <td>{leave.user["Full Name"]}</td>
              <td>{leave.leave_type}</td>
              <td>{new Date(leave.start_date).toLocaleDateString()}</td>
              <td>{new Date(leave.end_date).toLocaleDateString()}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === "pending" && (
                  <>
                    <button onClick={() => handleUpdate(leave._id, "approved")}>
                      Approve
                    </button>
                    <button onClick={() => handleUpdate(leave._id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
