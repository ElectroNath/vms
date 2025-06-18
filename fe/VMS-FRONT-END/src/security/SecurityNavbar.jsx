import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/SecurityNavbar.css";

function SecurityNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/login");
  };
  const closeMenu = () => setMenuOpen(false);
  return (
    <nav className="security-navbar-root">
      <div className="security-navbar-container">
        <button
          className="security-navbar-hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          &#9776;
        </button>
        <div className={`security-navbar-links${menuOpen ? " open" : ""}`} onClick={closeMenu}>
          <NavLink to="/security" className={({ isActive }) => isActive ? "security-navbar-link security-navbar-link-active" : "security-navbar-link"} end>
            Dashboard
          </NavLink>
          <NavLink to="/security/devices" className={({ isActive }) => isActive ? "security-navbar-link security-navbar-link-active" : "security-navbar-link"}>
            Devices
          </NavLink>
          <NavLink to="/security/scan-access" className={({ isActive }) => isActive ? "security-navbar-link security-navbar-link-active" : "security-navbar-link"}>
            Scan QR/Token
          </NavLink>
          <NavLink to="/security/guests" className={({ isActive }) => isActive ? "security-navbar-link security-navbar-link-active" : "security-navbar-link"}>
            Guests Today
          </NavLink>
        </div>
        <button className="security-navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default SecurityNavbar;
