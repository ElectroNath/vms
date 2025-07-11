// src/security/SecurityScan.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { API_BASE_URL } from "../api";
import "./security.css";

function SecurityScan() {
  const [qrValue, setQrValue] = useState("");
  const [deviceSerial, setDeviceSerial] = useState("");
  const [action, setAction] = useState("in");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const scanToken = async (value) => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const tokenVal = Cookies.get("token");
      const payload = {
        qr_value: value,
        device_serial: deviceSerial || null,
        action,
      };
      const res = await axios.post(
        `${API_BASE_URL}/api/security/access-logs/scan-qr/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${tokenVal}`,
          },
        }
      );
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Scan failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (qrValue) {
      await scanToken(qrValue);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .catch(() => alert("Camera access denied. Please allow camera permissions."));
  }, []);

  return (
    <div className="security-scan-page">
      <h2>Security QR Scan</h2>

      {/* QR Scanner */}
      <div className="security-qr-reader">
        <QrReader
          constraints={{ facingMode: "environment" }}
          scanDelay={500}
          onResult={(res) => {
            if (res?.text && res.text !== qrValue) {
              setQrValue(res.text);
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

      {/* Manual Input */}
      <form onSubmit={handleManualSubmit} className="security-scan-form">
        <input
          type="text"
          placeholder="QR/Token manually"
          value={qrValue}
          onChange={(e) => setQrValue(e.target.value)}
        />
        <input
          type="text"
          placeholder="Device Serial (optional)"
          value={deviceSerial}
          onChange={(e) => setDeviceSerial(e.target.value)}
        />
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="in">Check-In</option>
          <option value="out">Check-Out</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Error / Success */}
      {error && <div className="security-scan-error">{error}</div>}
      {result && (
        <div className="security-scan-result">
          <h4>{result.type === "device" ? "Device Info" : "Person Info"}</h4>
          <p><strong>Type:</strong> {result.type}</p>
          {result.person && (
            <>
              <p><strong>Name:</strong> {result.person.full_name || "N/A"}</p>
              <p><strong>Email:</strong> {result.person.email || "N/A"}</p>
            </>
          )}
          {result.device && (
            <>
              <p><strong>Device:</strong> {result.device.name}</p>
              <p><strong>Serial:</strong> {result.device.serial_number}</p>
            </>
          )}
          {result.status && <p><strong>Status:</strong> {result.status}</p>}
          {result.log && <p><strong>Log:</strong> {result.log}</p>}
        </div>
      )}
    </div>
  );
}

export default SecurityScan;
