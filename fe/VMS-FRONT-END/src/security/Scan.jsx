import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "./security.css";

function SecurityScan() {
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
    <div className="security-scan-page">
      <h2>Scan Guest QR/Token</h2>
      <form onSubmit={handleScan} className="security-scan-form">
        <input
          className="security-scan-input"
          placeholder="Enter guest token"
          value={token}
          onChange={e => setToken(e.target.value)}
          required
        />
        <button type="submit" className="security-scan-btn">
          Scan
        </button>
      </form>
      {error && <div className="security-scan-error">{error}</div>}
      {result && (
        <div className="security-scan-result">
          <h4>Guest Info</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SecurityScan;
