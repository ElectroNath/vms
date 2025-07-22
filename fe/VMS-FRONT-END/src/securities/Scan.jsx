import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { API_BASE_URL } from "../api";
import "./security.css";
import Modal from "../components/Modals";

function SecurityScan() {
  const [phase, setPhase] = useState(1);
  const [qrValue, setQrValue] = useState("");
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

  const handleScan = async (value) => {
    if (!value || lastScanned.current === value) return;
    lastScanned.current = value;

    const tokenVal = Cookies.get("token");

    if (phase === 1 && !personScanned.current) {
      personScanned.current = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/security/scan/`,
          { qr_value: value },
          { headers: { Authorization: `Bearer ${tokenVal}` } }
        );

        if (res.data.type === "employee" || res.data.type === "guest") {
          setQrValue(value);
          setResult(res.data);
          setPhase(2);
          lastScanned.current = null;
        } else {
          throw new Error("Not a valid person QR.");
        }
      } catch (err) {
        const errMsg = err?.response?.data?.detail || "Invalid or expired QR.";
        setError(errMsg);
        setModalMsg(errMsg);
        setModalSuccess(false);
        personScanned.current = false;
      }
    } else if (phase === 2 && !deviceScanned.current) {
      deviceScanned.current = true;
      setDeviceSerial(value);
    }
  };

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
          headers: { Authorization: `Bearer ${tokenVal}` },
        }
      );

      setResult(res.data);
      setModalMsg(res.data.log || "Scan successful!");
      setModalSuccess(true);
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

  const resetScanState = () => {
    setPhase(1);
    setQrValue("");
    setDeviceSerial("");
    personScanned.current = false;
    deviceScanned.current = false;
    lastScanned.current = null;
  };

  useEffect(() => {
    setScannerReady(true);
    return () => {
      setScannerReady(false);
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .catch(() =>
        alert("Camera access denied. Please allow camera permissions.")
      );
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {modalMsg && (
        <Modal
          message={modalMsg}
          onClose={() => setModalMsg("")}
          isSuccess={modalSuccess}
        />
      )}

      {scannerReady && (
        <>
          <div
            style={{
              position: "absolute",
              top: "20%",
              zIndex: 10,
              textAlign: "center",
              color: "white",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Scan QR Code
            </h2>
            <p>
              Scan the code to authenticate
              <br />
              users /employees/guests
            </p>
          </div>

          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          >
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {
                if (!!result) handleScan(result.getText());
                if (!!error) console.error(error);
              }}
              videoContainerStyle={{ width: "100%", height: "100%" }}
              videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "40px",
              zIndex: 10,
              display: "flex",
              gap: "20px",
            }}
          >
            <button
              style={{
                background: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Scan code"}
            </button>
            <button
              style={{
                background: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              Enter Code
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SecurityScan;
