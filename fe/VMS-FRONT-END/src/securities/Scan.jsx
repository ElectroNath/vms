import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { API_BASE_URL } from "../api";
import "./security.css";
import Modal from "../components/Modals";

function SecurityScan() {
  const [phase, setPhase] = useState(1); // 1 = token/ID, 2 = device
  const [qrValue, setQrValue] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [manualValid, setManualValid] = useState(null);
  const [deviceSerial, setDeviceSerial] = useState("");
  const [action, setAction] = useState("in");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [scannerReady, setScannerReady] = useState(true);

  const personScanned = useRef(false);
  const deviceScanned = useRef(false);
  const lastScanned = useRef(null);
  const tokenValidateTimer = useRef(null);

  // Validate token or QR for phase 1
  const validatePersonToken = async (value) => {
    const tokenVal = Cookies.get("token");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/security/validate-token/`,
        { qr_value: value },
        { headers: { Authorization: `Bearer ${tokenVal}` } }
      );

      if (res.data.type === "employee" || res.data.type === "guest") {
        setQrValue(value);
        setResult(res.data);
        setPhase(2);
        personScanned.current = true;
        setManualValid(true);
        lastScanned.current = null;
      } else {
        setManualValid(false);
      }
    } catch (err) {
      setManualValid(false);
      personScanned.current = false;
    }
  };

  const handleScan = async (value) => {
    if (!value || lastScanned.current === value) return;
    lastScanned.current = value;

    if (phase === 1 && !personScanned.current) {
      await validatePersonToken(value);
    } else if (phase === 2 && !deviceScanned.current) {
      deviceScanned.current = true;
      setDeviceSerial(value);
      await handleSubmit(); // auto submit
    }
  };

  const handleSubmit = async () => {
    const tokenVal = Cookies.get("token");
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/security/scan/`,
        {
          qr_value: qrValue,
          device_serial: deviceSerial || null,
          action,
        },
        { headers: { Authorization: `Bearer ${tokenVal}` } }
      );

      setModalMsg(res.data.log || "Scan successful");
      setModalSuccess(true);
      setResult(res.data);
      resetScanState();
    } catch (err) {
      const errMsg = err?.response?.data?.detail || "Scan failed.";
      setError(errMsg);
      setModalMsg(errMsg);
      setModalSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const skipDeviceScan = async () => {
    await handleSubmit();
  };

  const resetScanState = () => {
    setPhase(1);
    setQrValue("");
    setDeviceSerial("");
    setManualToken("");
    setManualValid(null);
    personScanned.current = false;
    deviceScanned.current = false;
    lastScanned.current = null;
  };

  // Manual token validation
  useEffect(() => {
    if (manualToken.trim().length < 3) {
      setManualValid(null);
      return;
    }

    clearTimeout(tokenValidateTimer.current);
    tokenValidateTimer.current = setTimeout(() => {
      validatePersonToken(manualToken.trim());
    }, 500);
  }, [manualToken]);

  useEffect(() => {
    setScannerReady(true);
    return () => setScannerReady(false);
  }, []);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true }).catch(() => {
      alert("Camera access denied. Please allow camera permissions.");
    });
  }, []);

  return (
    <div className="scanner-container">
      {modalMsg && (
        <Modal
          message={modalMsg}
          onClose={() => setModalMsg("")}
          isSuccess={modalSuccess}
        />
      )}

      <div className="scanner-header">
        <h2>Scan QR Code</h2>
        <p>
          {phase === 1
            ? "Scan ID or Token QR or enter manually"
            : "Scan Device QR (or skip)"}
        </p>

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          <option value="in">Check In</option>
          <option value="out">Check Out</option>
        </select>

        {phase === 1 && (
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Enter ID/Token manually"
              style={{
                padding: "10px",
                width: "260px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            {manualValid === true && (
              <div style={{ color: "lightgreen", marginTop: "5px" }}>
                ✓ Token is valid
              </div>
            )}
            {manualValid === false && (
              <div style={{ color: "red", marginTop: "5px" }}>
                ✗ Invalid or expired token
              </div>
            )}
          </div>
        )}
      </div>

      <div className="scanner-video">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) handleScan(result.getText());
          }}
          videoContainerStyle={{ width: "100%", height: "100%" }}
          videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div className="scanner-controls">
        {phase === 2 && (
          <button
            onClick={skipDeviceScan}
            className="scanner-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Skip Device Scan"}
          </button>
        )}
      </div>
    </div>
  );
}

export default SecurityScan;
