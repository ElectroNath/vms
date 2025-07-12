// src/security/AttendanceLog.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "./security.css";

function SecurityAccessLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/security/access-logs/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Ensure logs is always an array
        setLogs(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setLogs([]);
        setError("Failed to fetch logs");
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="attendance-log-page">
      <h2>Recent Access Logs</h2>
      {loading && <p>Loading logs...</p>}
      {error && <p className="security-scan-error">{error}</p>}
      {!loading && !error && logs.length === 0 && <p>No logs found.</p>}
      <table className="log-table">
        <thead>
          <tr>
            <th>Person</th>
            <th>Type</th>
            <th>Device</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.person_name || "N/A"}</td>
              <td>{log.person_type}</td>
              <td>{log.device_serial}</td>
              <td>{log.status}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SecurityAccessLog;
