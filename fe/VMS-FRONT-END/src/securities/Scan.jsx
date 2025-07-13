// src/security/SecurityScan.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { API_BASE_URL } from "../api";
import "./security.css";
import Modal from "../components/Modals";

function SecurityScan() {
  const [phase, setPhase] = useState(1); // 1: scan person, 2: scan device
  const [qrValue, setQrValue] = useState("");
  const [deviceSerial, setDeviceSerial] = useState("");
  const [action, setAction] = useState("in");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  // Handles scan for both phases
  const handleScan = (value) => {
    if (phase === 1) {
      setQrValue(value);
      setPhase(2);
    } else if (phase === 2) {
      setDeviceSerial(value);
    }
  };

  // Submit after both scans (or skip device)
  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const tokenVal = Cookies.get("token");
      const payload = {
        qr_value: qrValue,
        device_serial: deviceSerial || null,
        action,
      };
      const res = await axios.post(
        `${API_BASE_URL}/api/security/scan/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${tokenVal}`,
          },
        }
      );
      setResult(res.data);
      setModalMsg(res.data.log || "Scan successful!");
      setModalSuccess(true);
      setPhase(1);
      setQrValue("");
      setDeviceSerial("");
    } catch (err) {
      setError(err?.response?.data?.detail || "Scan failed.");
      setModalMsg(err?.response?.data?.detail || "Scan failed.");
      setModalSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Ensure modalMsg is set after submit
  useEffect(() => {
    if (result && result.log) {
      setModalMsg(result.log);
    }
    if (error) {
      setModalMsg(error);
    }
  }, [result, error]);

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .catch(() =>
        alert("Camera access denied. Please allow camera permissions.")
      );
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
