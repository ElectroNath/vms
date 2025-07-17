import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminAccessLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({
    person_type: "",
    person_name: "",
    person_id: "",
    device: "",
    scanned_by: "",
    time_in: "",
    time_out: "",
    status: "",
  });

  const [printDate, setPrintDate] = useState("");
  const [printMonth, setPrintMonth] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/access-logs/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        setLogs([]);
      }
    }

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) =>
    (filter.person_type === "" || (l.person_type || "").toLowerCase().includes(filter.person_type.toLowerCase())) &&
    (filter.person_name === "" || (l.person_name || "").toLowerCase().includes(filter.person_name.toLowerCase())) &&
    (filter.person_id === "" || String(l.person_id || "").toLowerCase().includes(filter.person_id.toLowerCase())) &&
    (filter.device === "" || (l.device || "").toLowerCase().includes(filter.device.toLowerCase())) &&
    (filter.scanned_by === "" || (l.scanned_by || "").toLowerCase().includes(filter.scanned_by.toLowerCase())) &&
    (filter.time_in === "" || (l.time_in || "").includes(filter.time_in)) &&
    (filter.time_out === "" || (l.time_out || "").includes(filter.time_out)) &&
    (filter.status === "" || (l.status || "").toLowerCase().includes(filter.status.toLowerCase()))
  );

  const getLogsToPrint = () => {
    if(printDate) {
      return filteredLogs.filter(log=>log.time_in?.startsWith(printDate));
    } else if (printMonth) {
      return filteredLogs.filter(log => log.time_in?.startsWith(printMonth));
    }
    return filteredLogs;
  }

  const handlePrint = () => {
    const logsToPrint = getLogsToPrint();
    const printWindow = window.open("","_blank");

    const html = `
    <html>
      <head>
        <title>Attendance Logs</title>
        <style>
          body { font-family: Arial, sans-serif; padding:20px; }
          h2 { text-align: center; margin-bottom: 20px;}
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h2>Attendance Logs</h2>
        <table>
          <thead>
            <tr>
              <th>Person Type</th>
              <th>Person Name</th>
              <th>Person ID</th>
              <th>Device Serial</th>
              <th>Scanned By</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${logsToPrint.map(log => `
              <tr>
                <td>${log.person_type}</td>
                <td>${log.person_name}</td>
                <td>${log.person_id}</td>
                <td>${log.device}</td>
                <td>${log.scanned_by}</td>
                <td>${log.time_in}</td>
                <td>${log.time_out}</td>
                <td>${log.status}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }

  return (
      <div className="admin-table-page">
        <h2>Access Logs</h2>

      <div style={{ marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontWeight: 500, marginRight: 8, color: "#444" }}>
          Filter logs by:
        </span>
        {/* <div className="login-input-group-filter">
        <input
          className="login-input"
          style={{ width: 110 }}
          placeholder="Person Type"
          value={filter.person_type}
          onChange={(e) => setFilter({ ...filter, person_type: e.target.value })}
        />
        <span className="login-input-label">persontype</span>
        </div> */}
        <div className="login-input-group-filter">
        <input
          className="login-input"
          style={{ width: 140 }}
          placeholder="Person Name"
          value={filter.person_name}
          onChange={(e) => setFilter({ ...filter, person_name: e.target.value })}
        />
        <span className="login-input-label">personname</span>
        </div>
        {/* <div className="login-input-group-filter">
        <input
          className="login-input"
          style={{ width: 90 }}
          placeholder="Person ID"
          value={filter.person_id}
          onChange={(e) => setFilter({ ...filter, person_id: e.target.value })}
        />
        <span className="login-input-label">personid</span>
        </div> */}
        <div className="login-input-group-filter">
        <input
          className="login-input"
          style={{ width: 130 }}
          placeholder="Device Serial"
          value={filter.device}
          onChange={(e) => setFilter({ ...filter, device: e.target.value })}
        />
        <span className="login-input-label">deviceserial</span>
        </div>
        <div className="login-input-group-filter">
        <input
          className="login-input"
          style={{ width: 120 }}
          placeholder="Scanned By"
          value={filter.scanned_by}
          onChange={(e) => setFilter({ ...filter, scanned_by: e.target.value })}
        />
        <span className="login-input-label">scannedby</span>
        </div>
        <div className="login-input-group-filter">
        <input
          className="login-input"
          style={{ width: 140 }}
          placeholder="Time In (YYYY-MM-DD)"
          value={filter.time_in}
          onChange={(e) => setFilter({ ...filter, time_in: e.target.value })}
        />
        <span className="login-input-label">date</span>
        </div>
        {/* <div className="login-input-group-filter">
        <input
          className="login-input"
          style={{ width: 140 }}
          placeholder="Time Out (YYYY-MM-DD)"
          value={filter.time_out}
          onChange={(e) => setFilter({ ...filter, time_out: e.target.value })}
        />
        <span className="login-input-label">timeout</span>
        </div> */}
        {/* <input
          className="login-input"
          style={{ width: 90 }}
          placeholder="Status"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        /> */}
        <button
          className="login-btn"
          style={{ background: "#aaa", fontSize: 14, padding: "6px 16px" }}
          onClick={() =>
            setFilter({
              person_type: "",
              person_name: "",
              person_id: "",
              device: "",
              scanned_by: "",
              time_in: "",
              time_out: "",
              status: "",
            })
          }
          type="button"
        >
          Clear
        </button>
      </div>

      
      {/* Print Filters */}
      <div style={{ display: "flex", gap: 10, margin: "16px 0", flexWrap: "wrap" }}>
        <div className="login-input-group-filter">
          <input
            type="date"
            className="login-input"
            value={printDate}
            onChange={(e) => {
              setPrintDate(e.target.value);
              setPrintMonth("");
            }}
          />
          <span className="login-input-label">date</span>
        </div>
        
      <div className="login-input-group-filter">
        <input
          type="month"
          className="login-input"
          value={printMonth}
          onChange={(e) => {
            setPrintMonth(e.target.value);
            setPrintDate("");
          }}
        />
        <span className="login-input-label">month</span>
      </div>
      <button
        className="login-btn"
        style={{ background: "#247150", padding: "0px 6px" }}
        onClick={handlePrint}
      >
        Print Logs
      </button>
    </div>

    
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Person Type</th>
            <th>Person Name</th>
            <th>Person ID</th>
            <th>Device Serial</th>
            <th>Scanned By</th>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((l) => {
            const timeIn = l.time_in ? new Date(l.time_in) : null;
            const timeOut = l.time_out ? new Date(l.time_out) : null;

            const date = timeIn ? timeIn.toISOString().split("T")[0] : "N/A";
            const timeInStr = timeIn ? timeIn.toTimeString().split(" ")[0] : "—";
            const timeOutStr = timeOut ? timeOut.toTimeString().split(" ")[0] : "—";

            return (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.person_type}</td>
                <td>{l.person_name || "N/A"}</td>
                <td>{l.person_id}</td>
                <td>{l.device}</td>
                <td>{l.scanned_by}</td>
                <td>{date}</td>
                <td>{timeInStr}</td>
                <td>{timeOutStr}</td>
                <td>{l.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    
  );
}

export default AdminAccessLogs;
