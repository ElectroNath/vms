import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { API_BASE_URL } from "../api";
import "../styles/SecurityDashboard.css";

const SecurityDashboard = () => {
  const [metrics, setMetrics] = useState({
    registeredDevices: 0,
    verifiedDevices: 0,
    guestsToday: 0,
    expectedGuests: 0,
    accessLogsToday: 0,
  });

  const [scanStep, setScanStep] = useState(1);
  const [personInfo, setPersonInfo] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [scanError, setScanError] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [manualValue, setManualValue] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/security/dashboard/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setMetrics({
          registeredDevices: res.data.device_count || 0,
          verifiedDevices: res.data.verified_device_count || 0,
          guestsToday: res.data.guests_today || 0,
          expectedGuests: res.data.expected_guests_today || 0,
          accessLogsToday: res.data.access_logs_today || 0,
        });
      } catch {
        setMetrics({
          registeredDevices: 0,
          verifiedDevices: 0,
          guestsToday: 0,
          expectedGuests: 0,
          accessLogsToday: 0,
        });
      }
    };

    fetchMetrics();
  }, []);

  const handleScan = async (data) => {
    if (!data) return;
    setScanError("");

    try {
      const token = Cookies.get("token");

      if (scanStep === 1) {
        const res = await axios.post(
          `${API_BASE_URL}/api/security/scan/`,
          { qr_value: data },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.type === "device") {
          setScanError("⚠️ Scan the person (employee/guest) first.");
        } else {
          setPersonInfo(res.data.person);
          setScanStep(2);
        }
      } else if (scanStep === 2 && personInfo) {
        const res = await axios.post(
          `${API_BASE_URL}/api/security/scan/`,
          {
            qr_value: personInfo.staff_id || personInfo.token,
            device_serial: data,
            action: "in",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDeviceInfo(res.data.device);
        setScanResult(res.data);
        setScanStep(1);
        setPersonInfo(null);
      }
    } catch (err) {
      setScanError("❌ Invalid QR code or network error.");
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setScanError("");

    try {
      const token = Cookies.get("token");

      if (scanStep === 1) {
        const res = await axios.post(
          `${API_BASE_URL}/api/security/scan/`,
          { qr_value: manualValue },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.type === "device") {
          setScanError("⚠️ Enter the person token first.");
        } else {
          setPersonInfo(res.data.person);
          setScanStep(2);
        }
      } else if (scanStep === 2 && personInfo) {
        const res = await axios.post(
          `${API_BASE_URL}/api/security/scan/`,
          {
            qr_value: personInfo.staff_id || personInfo.token,
            device_serial: manualValue,
            action: "in",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDeviceInfo(res.data.device);
        setScanResult(res.data);
        setScanStep(1);
        setPersonInfo(null);
      }

      setManualValue("");
    } catch {
      setScanError("❌ Invalid or not found.");
    }
  };

  return (
    <div className="security-dashboard-root">
      <h2 className="security-dashboard-title">Security Dashboard</h2>

      <div className="security-dashboard-cards">
        <div className="security-dashboard-card card-num"> Registered Devices: {metrics.registeredDevices}</div>
        <div className="security-dashboard-card card-num">Verified Devices: {metrics.verifiedDevices}</div>
        <div className="security-dashboard-card card-num">Guests Today: {metrics.guestsToday}</div>
        <div className="security-dashboard-card card-num">Expected Guests: {metrics.expectedGuests}</div>
        <div className="security-dashboard-card card-num">Access Logs Today: {metrics.accessLogsToday}</div>
      </div>

      <div className="security-dashboard-scan-section">
        <h3 className="security-dashboard-scan-title">
          Step {scanStep}: {scanStep === 1 ? "Scan Person Token" : "Scan Device QR"}
        </h3>

        <div className="security-dashboard-scan-camera ">
  <QrReader
    constraints={{ facingMode: 'environment' }}
    onResult={(result, error) => {
      if (!!result) {
        handleScan({ text: result?.text });
      }
      if (!!error && error.name !== 'NotFoundError') {
        handleScanError(error);
      }
    }}
    containerStyle={{ width: '100%', maxWidth: 400 }}
    videoStyle={{ width: '100%', height: 'auto' }}
  />
</div>


        <form className="manual-input-form" onSubmit={handleManualSubmit}>
          <input
            className="manual-input"
            type="text"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            placeholder="Enter manually if needed"
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>

        {scanError && <p className="security-dashboard-scan-error">{scanError}</p>}
        {scanResult && (
          <div className="security-dashboard-scan-result">
            ✅ Access logged for: {scanResult.device?.device_name || "Device"}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
