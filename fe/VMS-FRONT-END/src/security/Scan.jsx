import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/SecurityDashboard.css";
import QrCodeScanner from "./QrScanner";

function SecurityScan() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // When QR code is scanned, auto-submit
  const handleQrScan = (qrToken) => {
    setToken(qrToken);
    setShowScanner(false);
    setTimeout(() => handleScan(), 100); // slight delay to allow state update
  };

  return (
    <div className="admin-table-page" style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 18 }}>Scan Guest QR/Token</h2>
      <div style={{ marginBottom: 18 }}>
        <button
          className="login-btn"
          type="button"
          style={{ marginBottom: 8, minWidth: 160 }}
          onClick={() => setShowScanner(s => !s)}
        >
          {showScanner ? "Manual Entry" : "Scan QR Code"}
        </button>
      </div>
      <div style={{ color: "#555", marginBottom: 18 }}>
        Enter or scan a guest's token to verify their invitation and access status.
      </div>
      {showScanner ? (
        <div style={{ marginBottom: 18 }}>
          <QrCodeScanner onScan={handleQrScan} onError={err => setError("Could not read QR code.")} />
        </div>
      ) : (
        <form onSubmit={handleScan} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <input
            className="login-input"
            style={{ flex: 1, fontSize: 18, padding: 10 }}
            placeholder="Enter guest token"
            value={token}
            onChange={e => setToken(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="login-btn" style={{ minWidth: 100 }} disabled={loading}>
            {loading ? "Scanning..." : "Scan"}
          </button>
        </form>
      )}
      {error && <div style={{ color: "#c00", marginBottom: 18 }}>{error}</div>}
      {result && (
        <div style={{ background: "#f7fafd", borderRadius: 8, padding: 18, marginTop: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h4 style={{ margin: 0, marginBottom: 8, color: "#1a7bb7" }}>Guest Info</h4>
          <div style={{ fontSize: 16, marginBottom: 6 }}><b>Name:</b> {result.full_name}</div>
          <div style={{ fontSize: 16, marginBottom: 6 }}><b>Phone:</b> {result.phone}</div>
          <div style={{ fontSize: 16, marginBottom: 6 }}><b>Purpose:</b> {result.purpose}</div>
          <div style={{ fontSize: 16, marginBottom: 6 }}><b>Visit Date:</b> {result.visit_date}</div>
          <div style={{ fontSize: 16, marginBottom: 6 }}><b>Verified:</b> {result.is_verified ? "Yes" : "No"}</div>
          <div style={{ fontSize: 16, marginBottom: 6 }}><b>Token:</b> {result.token}</div>
        </div>
      )}
    </div>
  );
}

export default SecurityScan;
