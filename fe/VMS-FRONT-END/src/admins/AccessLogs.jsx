import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminAccessLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/access-logs/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch {
        setLogs([]);
      }
    }
    fetchLogs();
  }, []);
  return (
    <div className="admin-table-page">
      <h2>Access Logs</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Person Type</th>
            <th>Person ID</th>
            <th>Device Serial</th>
            <th>Scanned By</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.person_type}</td>
              <td>{l.person_id}</td>
              <td>{l.device_serial}</td>
              <td>{l.scanned_by}</td>
              <td>{l.time_in}</td>
              <td>{l.time_out}</td>
              <td>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAccessLogs;
