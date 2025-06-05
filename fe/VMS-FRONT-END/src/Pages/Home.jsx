import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { API_BASE_URL } from "../api";

function Home() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [deviceCount, setDeviceCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [attendanceIn, setAttendanceIn] = useState(0);
  const [attendanceOut, setAttendanceOut] = useState(0);
  const [devices, setDevices] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [modalQrUrl, setModalQrUrl] = useState(""); // For modal QR
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [activeMenu, setActiveMenu] = useState(0);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        // Fetch employee profile for username, id, and role
        const profileRes = await axios.get(
          `${API_BASE_URL}/api/employee-profiles/me/`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setUsername(profileRes.data.username);
        if (profileRes.data.id) {
          setProfileId(profileRes.data.id);
        }
        if (profileRes.data.role) {
          setRole(profileRes.data.role);
        }

        // Fetch dashboard data
        const res = await axios.get(
          `${API_BASE_URL}/api/employee-profiles/dashboard/`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setFullName(res.data.full_name);
        setStaffId(res.data.staff_id);
        setDeviceCount(res.data.device_count);
        setGuestCount(res.data.guest_count);
        setAttendanceIn(res.data.attendance_in);
        setAttendanceOut(res.data.attendance_out);
        setDevices(res.data.devices);

        // Fetch attendance logs
        const attendanceRes = await axios.get(
          `${API_BASE_URL}/api/employee-profiles/attendance/`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setAttendanceLogs(attendanceRes.data);

        setError("");
      } catch (err) {
        // If unauthorized, redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate("/login", { replace: true });
        } else {
          setError("Unable to fetch dashboard. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // Handler to open modal and fetch QR code using staffId dynamically in the path
  const handleShowQrModal = async () => {
    if (!staffId) {
      setModalQrUrl("");
      setShowQrModal(true);
      return;
    }
    try {
      // Construct the correct media path for the QR code image
      const qrUrl = `${API_BASE_URL}/media/qr_codes/${staffId}_qr.png`;
      const res = await axios.get(qrUrl, { responseType: "blob" });
      const qrBlobUrl = URL.createObjectURL(res.data);
      setModalQrUrl(qrBlobUrl);
    } catch (err) {
      setModalQrUrl("");
    }
    setShowQrModal(true);
  };

  // Print QR code function
  const handlePrintQr = () => {
    if (!modalQrUrl) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            img { width: 300px; height: 300px; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${modalQrUrl}" alt="QR Code" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="home-root">
      {/* Overlay for loading */}
      {loading && (
        <div className="dashboard-overlay dashboard-overlay-fade">
          <div className="dashboard-spinner"></div>
          <div className="dashboard-loading-text">Loading Dashboard...</div>
        </div>
      )}
      {/* Main Content */}
      <div className={`home-main${loading ? " blurred" : ""}`}>
        <div className="home-main-title"></div>
        {loading ? (
          <div className="dashboard-loader">
            <div className="dashboard-spinner"></div>
          </div>
        ) : (
          <div className="dashboard-container">
            <div className="dashboard-profile">
              <p>
                <strong>{fullName}</strong>
              </p>
              <p>
                <strong>{staffId}</strong>
              </p>
            </div>
            <div className="dashboard-metrics">
              <div className="dashboard-card">
                <h3>Devices</h3>
                <p>{deviceCount}</p>
              </div>
              <div className="dashboard-card">
                <h3>Guests</h3>
                <p>{guestCount}</p>
              </div>

              {/* QR Code Card */}
              <div
                className="dashboard-card dashboard-qr-card"
                onClick={handleShowQrModal}
                style={{ cursor: staffId ? "pointer" : "default" }}
                title={staffId ? "Click to view QR Code" : ""}
              >
                <h3>Staff QR Code</h3>
                {staffId ? (
                  <span style={{ fontSize: 12, color: "#888" }}>
                    Click to view
                  </span>
                ) : (
                  <p>No QR Code Available</p>
                )}
              </div>
            </div>

            {/* Attendance Table */}
            <div className="dashboard-attendance">
              <h3>Attendance Logs</h3>
              {attendanceLogs.length > 0 ? (
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{log.date}</td>
                        <td>{log.time_in || "-"}</td>
                        <td>{log.time_out || "-"}</td>
                        <td>{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No attendance records found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          className="qr-modal-overlay"
          onClick={() => setShowQrModal(false)}
        >
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Your Staff ID QR Code</h3>
            {modalQrUrl ? (
              <>
                <img
                  src={modalQrUrl}
                  alt="Full QR Code"
                  className="qr-modal-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    // Show a fallback message if the image fails to load
                    const fallback = document.createElement("p");
                    fallback.textContent =
                      "QR Code not available (no id_qr_code found for your profile).";
                    fallback.style.color = "#c00";
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
                <button
                  className="qr-modal-print-btn"
                  style={{ marginRight: 10 }}
                  onClick={handlePrintQr}
                >
                  Print QR Code
                </button>
              </>
            ) : (
              <p>QR Code not available (no id_qr_code found for your profile).</p>
            )}
            <button
              className="qr-modal-close-btn"
              onClick={() => setShowQrModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
