import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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

  // Remove QR code fetching from useEffect, only set profileId
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = Cookies.get("token");

        // Fetch employee profile for username and id
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
        setError("");
      } catch (err) {
        setError("Unable to fetch dashboard. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Handler to open modal and fetch QR code only when needed
  const handleShowQrModal = () => {
    if (profileId) {
      const qrUrl = `${API_BASE_URL}/api/employee-profiles/${profileId}/qr-code/?t=${Date.now()}`;
      setModalQrUrl(qrUrl);
    } else {
      setModalQrUrl("");
    }
    setShowQrModal(true);
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
      {/* Sidebar */}
      <div className={`home-sidebar${loading ? " blurred" : ""}`}>
        <div className="home-sidebar-header">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="avatar"
            className="home-avatar"
          />
          <div className="home-welcome">
            HI {username && <span>{username.toUpperCase()}</span>}
            {error && <p className="home-error">{error}</p>}
          </div>
        </div>
        {/* Optionally show QR code in sidebar */}
        {profileId && (
          <div style={{ margin: "20px auto", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#fff" }}>My QR Code</div>
          </div>
        )}
        <div className="home-menu">
          <div className="home-menu-item home-menu-item-active">Home</div>
          <div className="home-menu-item">Register Staff</div>
          <div className="home-menu-item">Invite Guest</div>
          <div className="home-menu-item">Register Devices</div>
        </div>
      </div>
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
                <strong>Full Name:</strong> {fullName}
              </p>
              <p>
                <strong>Staff ID:</strong> {staffId}
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
              <div className="dashboard-card">
                <h3>Checked In</h3>
                <p>{attendanceIn}</p>
              </div>
              <div className="dashboard-card">
                <h3>Checked Out</h3>
                <p>{attendanceOut}</p>
              </div>

              {/* QR Code Card */}
              <div
                className="dashboard-card dashboard-qr-card"
                onClick={handleShowQrModal}
                style={{ cursor: profileId ? "pointer" : "default" }}
                title={profileId ? "Click to view QR Code" : ""}
              >
                <h3>Staff QR Code</h3>
                {profileId ? (
                  <span style={{ fontSize: 12, color: "#888" }}>
                    Click to view
                  </span>
                ) : (
                  <p>No QR Code Available</p>
                )}
              </div>
            </div>
            <div className="dashboard-devices">
              <h3>Registered Devices</h3>
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <div key={index} className="device-item">
                    <p>
                      <strong>Name:</strong> {device.name}
                    </p>
                    <p>
                      <strong>Serial Number:</strong> {device.serial_number}
                    </p>
                  </div>
                ))
              ) : (
                <p>No devices registered.</p>
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
              <img
                src={modalQrUrl}
                alt="Full QR Code"
                className="qr-modal-img"
                onError={e => {
                  e.target.style.display = "none";
                  // Show a fallback message if the image fails to load
                  const fallback = document.createElement("p");
                  fallback.textContent = "QR Code not available (no id_qr_code found for your profile).";
                  fallback.style.color = "#c00";
                  e.target.parentNode.appendChild(fallback);
                }}
              />
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
