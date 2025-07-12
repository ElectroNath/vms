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
        const res = await axios.get(`${API_BASE_URL}/api/access-logs/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Ensure logs is always an array
        setLogs(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError("Failed to fetch logs");
        }
        setLogs([]);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="admin-table-page">
      <h2>Scan Guest QR/Token</h2>
      <form onSubmit={handleScan} style={{ marginBottom: 20 }}>
        <input
          className="login-input"
          style={{ width: 220 }}
          placeholder="Enter guest token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <button type="submit" className="login-btn" style={{ marginLeft: 10 }}>
          Scan
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>Guest Info</h4>
          <pre style={{ background: "#f7f7f7", padding: 10 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default SecurityAccessLog;
