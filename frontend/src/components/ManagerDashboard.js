// src/components/ManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import { getLeaves, updateLeaveStatus } from "../services/api";
import Navbar from "./Navbar";
import "./ManagerDashboard.css";

// React Big Calendar
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Excel Export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function ManagerDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [activeStatus, setActiveStatus] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await getLeaves();
      setLeaves(data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      console.error("Error updating leave:", err);
    }
  };

  const filterLeaves = (status) => {
    return leaves
      .filter((leave) => leave.status === status)
      .filter((leave) =>
        searchTerm
          ? leave.user["Full Name"]
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          : true
      )
      .filter((leave) =>
        selectedMonth
          ? new Date(leave.start_date).toISOString().slice(0, 7) ===
            selectedMonth
          : true
      )
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  };

  const renderTable = (status) => {
    const filtered = filterLeaves(status);
    if (filtered.length === 0) {
      return <p className="no-data">No {status} leave requests.</p>;
    }

    return (
      <table className="leave-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            {status === "pending" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.user["Full Name"]}</td>
              <td>{leave.leave_type}</td>
              <td>{new Date(leave.start_date).toLocaleDateString()}</td>
              <td>{new Date(leave.end_date).toLocaleDateString()}</td>
              <td className={`status ${leave.status}`}>{leave.status}</td>
              {status === "pending" && (
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleUpdate(leave._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleUpdate(leave._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const pendingCount = filterLeaves("pending").length;
  const approvedCount = filterLeaves("approved").length;
  const rejectedCount = filterLeaves("rejected").length;

  // Prepare events for calendar (approved leaves only)
  const calendarEvents = leaves
    .filter((leave) => leave.status === "approved")
    .map((leave) => ({
      title: `${leave.user["Full Name"]} (${leave.leave_type})`,
      start: new Date(leave.start_date),
      end: new Date(leave.end_date),
      allDay: true,
    }));

  // Export current tab to Excel
  const exportToExcel = (status) => {
    const filtered = filterLeaves(status);
    if (filtered.length === 0) {
      alert(`No ${status} data to export!`);
      return;
    }

    const exportData = filtered.map((leave) => ({
      Employee: leave.user["Full Name"],
      Type: leave.leave_type,
      Start: new Date(leave.start_date).toLocaleDateString(),
      End: new Date(leave.end_date).toLocaleDateString(),
      Status: leave.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${status} Leaves`);
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${status}_leave_report.xlsx`);
  };

  // Export all data to Excel (3 sheets)
  const exportAllToExcel = () => {
    const statuses = ["pending", "approved", "rejected"];
    const workbook = XLSX.utils.book_new();

    statuses.forEach((status) => {
      const filtered = filterLeaves(status);
      const exportData = filtered.map((leave) => ({
        Employee: leave.user["Full Name"],
        Type: leave.leave_type,
        Start: new Date(leave.start_date).toLocaleDateString(),
        End: new Date(leave.end_date).toLocaleDateString(),
        Status: leave.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${status.charAt(0).toUpperCase() + status.slice(1)}`
      );
    });

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `all_leave_reports.xlsx`);
  };

  return (
    <div className="manager-page">
      <Navbar />
      <div className="manager-container">
        <h2 className="manager-title">Manager Dashboard</h2>

        {/* Summary Panel */}
        <div className="summary-panel">
          <div
            className={`summary-item ${
              activeStatus === "pending" ? "active" : ""
            }`}
            onClick={() => setActiveStatus("pending")}
          >
            <h4>Pending</h4>
            <p>{pendingCount}</p>
          </div>
          <div
            className={`summary-item ${
              activeStatus === "approved" ? "active" : ""
            }`}
            onClick={() => setActiveStatus("approved")}
          >
            <h4>Approved</h4>
            <p>{approvedCount}</p>
          </div>
          <div
            className={`summary-item ${
              activeStatus === "rejected" ? "active" : ""
            }`}
            onClick={() => setActiveStatus("rejected")}
          >
            <h4>Rejected</h4>
            <p>{rejectedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Export Buttons */}
        <div className="export-bar">
          <button onClick={() => exportToExcel(activeStatus)}>
            Export {activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}
          </button>
          <button onClick={exportAllToExcel}>Export All</button>
        </div>

        {/* Table View */}
        <div className="tab-content">{renderTable(activeStatus)}</div>

        {/* Leave Calendar */}
        <h3 className="calendar-title">Leave Calendar (Approved Only)</h3>
        <div className="leave-calendar">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: "20px 0" }}
          />
        </div>
      </div>
    </div>
  );
}
