import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../styles/Home.css";
import { API_BASE_URL } from "../api";
import Logout from "./Logout";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();

  // Always determine active menu index from current path
  const menuRoutes = [
    "/home",
    "/register-staff",
    "/invite-guest",
    "/register-devices"
  ];
  const getMenuIndexFromPath = (pathname) => {
    // Use exact match for home, and startsWith for others
    if (pathname === "/home") return 0;
    if (pathname.startsWith("/register-staff")) return 1;
    if (pathname.startsWith("/invite-guest")) return 2;
    if (pathname.startsWith("/register-devices")) return 3;
    return 0;
  };
  const [currentIndex, setCurrentIndex] = useState(getMenuIndexFromPath(location.pathname));

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

  useEffect(() => {
    setCurrentIndex(getMenuIndexFromPath(location.pathname));
    // eslint-disable-next-line
  }, [location.pathname]);

  // Filter menu items based on user role (don't render until role is loaded)
  const menuItems =
    role === null
      ? []
      : allMenuItems
          .filter(item => String(role).toLowerCase() === "employee"
            ? item.roles.includes("employee")
            : item.roles.includes(role))
          .map(item => item.label);

  return (
    <div className="home-sidebar" style={{ position: "relative", minHeight: "100vh" }}>
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
              menuItems.map((item, idx) => {
                // Find the route for this menu item
                const routeIdx = allMenuItems.findIndex(m => m.label === item);
                const route = menuRoutes[routeIdx];
                return (
                  <div
                    key={item}
                    className={
                      "home-menu-item" +
                      (getMenuIndexFromPath(location.pathname) === routeIdx ? " home-menu-item-active" : "")
                    }
                    onClick={() => {
                      navigate(route);
                    }}
                  >
                    {item}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
      <div
        className="navbar-logout-btn-wrapper"
        style={{
          position: "absolute",
          bottom: 80, // push up from the bottom
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Logout
          className="navbar-logout-btn"
          style={{
            color: "#fff",
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 600,
            fontSize: 17,
            background: "linear-gradient(90deg, #e53935 0%, #c62828 100%)",
            border: "none",
            borderRadius: "8px",
            padding: "10px 22px",
            cursor: "pointer",
            boxShadow: "0 2px 8px #c6282833",
            transition: "background 0.18s, box-shadow 0.18s"
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 6 }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </Logout>
      </div>
    </div>
  );
}

export default Navbar;
