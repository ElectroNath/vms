import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logout from "../components/Logout";
import "../styles/Admin.css";

const menu = [
  { label: "Dashboard", path: "" },
  { label: "Users", path: "users" },
  { label: "Employees", path: "employees" },
  { label: "Devices", path: "devices" },
  { label: "Guests", path: "guests" },
  { label: "Messages", path: "messages" },
  { label: "Access Logs", path: "access-logs" },
];

function AdminNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const Hamburger = isMobile && (
    <button
      className="hamburger-btn"
      aria-label="Toggle menu"
      onClick={() => setSidebarOpen((open) => !open)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 34,
        height: 34,
        margin: 2,
        zIndex: 1001,
      }}
    >
      <span className="hamburger-bar" />
      <span className="hamburger-bar" />
      <span className="hamburger-bar" />
    </button>
  );

  return (
    <>
      <div className="mobile-hamburger-wrapper">{Hamburger}</div>

      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.35)",
            zIndex: 1000,
          }}
        />
      )}

      <nav
        className={`admin-navbar${isMobile && sidebarOpen ? " open" : ""}`}
        style={{
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                left: sidebarOpen ? 0 : "-260px",
                width: 200,
                height: "100vh",
                zIndex: 1001,
                background: "#247150",
                transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
                boxShadow: sidebarOpen ? "2px 0 12px rgba(0,0,0,0.18)" : "none",
                borderTopRightRadius: "32px",
                borderBottomRightRadius: "32px",
              }
            : {
                position: "relative",
                minHeight: "100vh",
                width: 250,
                background: "#247150",
              }),
        }}
      >
        <div
          className="admin-navbar-title"
          style={{ padding: "1rem", color: "#fff", fontWeight: "bold" }}
        >
          Admin Panel
        </div>

        <div className="admin-navbar-menu" style={{ padding: "1rem" }}>
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={`/admin/${item.path}`}
              end={item.path === ""}
              className={({ isActive }) =>
                "admin-navbar-link" +
                (isActive ? " admin-navbar-link-active" : "")
              }
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Logout className="navbar-logout-btn">
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </Logout>
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
