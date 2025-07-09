import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import { QrReader } from "react-qr-reader";
import "./security.css";

function SecurityScan() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const scanToken = async (scannedToken) => {
    setError("");
    setResult(null);
    try {
      const tokenVal = Cookies.get("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/security/access-logs/scan-qr/`,
        { token: scannedToken },
        { headers: { Authorization: `Bearer ${tokenVal}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError("Guest not found or invalid token.");
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      await scanToken(token);
    }
  };

  return (
    <div className="security-scan-page">
      <h2>Scan Guest QR/Token</h2>

      {/* QR Scanner */}
      <div className="security-qr-reader">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result?.text && result.text !== token) {
              setToken(result.text);
              scanToken(result.text);
            }
          }}
          style={{ width: "100%", maxWidth: 400, height: "300px" }}
        />
      </div>

      {/* Manual Input */}
      <form onSubmit={handleManualSubmit} className="security-scan-form">
        <input
          className="security-scan-input"
          placeholder="Or enter token manually"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit" className="security-scan-btn">
          Submit
        </button>
      </form>

      {/* Result / Error */}
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
