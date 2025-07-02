import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";
import "../styles/Login.css";

function SecurityAccessLogScan() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const tokenVal = Cookies.get("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/security/access-logs/scan-qr/`,
        { token },
        { headers: { Authorization: `Bearer ${tokenVal}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError("Guest not found or invalid token.");
    }
  };

  return (
    <div className="admin-table-page">
      <h2>Scan Guest QR/Token</h2>
      <form onSubmit={handleScan} style={{ marginBottom: 20 }}>
        <input
          className="login-input"
          style={{ width: 220 }}
          placeholder="Enter guest token"
          value={token}
          onChange={e => setToken(e.target.value)}
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
          <pre style={{ background: "#f7f7f7", padding: 10 }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SecurityAccessLogScan;
