import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import { QrReader } from "@blackbox-vision/react-qr-reader";
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

  useEffect(() => {
  navigator.mediaDevices?.getUserMedia({ video: true }).catch(() => {
    alert("Camera access denied. Please allow camera permissions.");
  });
}, []);

  return (
    <div className="security-scan-page">
      <h2>Scan Guest QR/Token</h2>

      {/* QR Scanner */}
      <div className="security-qr-reader">
        <QrReader
          constraints={{ facingMode: "environment" }}
          scanDelay={500}
          onResult={(res, err) => {
            if (res?.text && res.text !== token) {
              setToken(res.text);
              scanToken(res.text);
            }
          }}
          videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          containerStyle={{
            width: "100%",
            maxWidth: "600px",
            height: "400px",
            border: "2px solid #1abc9c",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        />
        <div className="scanner-line"></div>
      </div>
      <br></br>
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
