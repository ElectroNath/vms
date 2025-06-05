import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../styles/Home.css";
import { API_BASE_URL } from "../api";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";

const allMenuItems = [
  { label: "Home", roles: ["admin", "employee", "security"] },
  { label: "Register Staff", roles: ["admin"] },
  { label: "Invite Guest", roles: ["employee"] },
  { label: "Register Devices", roles: ["security"] },
];

function Navbar({ activeIndex, onMenuClick }) {
  const [username, setUsername] = useState("");
  const [profileId, setProfileId] = useState(null);
  const [role, setRole] = useState(null); // default to null for first render
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
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
        // Use null check to avoid empty string bug
        setRole(profileRes.data.role || null);
        setError("");
      } catch (err) {
        setError("Unable to fetch profile.");
      }
    };
    fetchProfile();
  }, []);

  // Filter menu items based on user role (don't render until role is loaded)
  const menuItems =
    role === null
      ? []
      : allMenuItems
          .filter(item => String(role).toLowerCase() === "employee"
            ? item.roles.includes("employee")
            : item.roles.includes(role))
          .map(item => item.label);

  // Map menu index to route paths (must match your AppRouter/App.jsx)
  const menuRoutes = [
    "/home",
    "/register-staff",
    "/invite-guest",
    "/register-devices"
  ];

  return (
    <div className="home-sidebar">
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
      {profileId && (
        <div style={{ margin: "20px auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#fff" }}>My QR Code</div>
        </div>
      )}
      <div className="home-menu">
        {/* Only render menu when role is loaded */}
        {role === null && !error ? (
          <div style={{ color: "#fff", padding: "16px" }}>Loading menu...</div>
        ) : error ? (
          <div style={{ color: "#ff4d4f", padding: "16px" }}>
            Error loading menu. {error}
          </div>
        ) : (
          <>
            {menuItems.length === 0 ? (
              <div style={{ color: "#ff9800", padding: "16px" }}>
                No menu available for your role.
              </div>
            ) : (
              menuItems.map((item, idx) => (
                <div
                  key={item}
                  className={
                    "home-menu-item" +
                    (activeIndex === idx ? " home-menu-item-active" : "")
                  }
                  onClick={() => {
                    onMenuClick && onMenuClick(idx);
                    // Navigate to the correct route for the menu
                    navigate(menuRoutes[
                      allMenuItems.findIndex(m => m.label === item)
                    ]);
                  }}
                >
                  {item}
                </div>
              ))
            )}
            <Logout
              className="home-menu-item"
              style={{ color: "#c00", marginTop: 30 }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
