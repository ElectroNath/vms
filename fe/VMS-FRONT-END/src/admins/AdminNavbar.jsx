import React from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  const location = useLocation();
  // Remove the "." for Dashboard, use "" so it matches the index route
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-title">Admin Panel</div>
      <div className="admin-navbar-menu">
        {menu.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ""}
            className={({ isActive }) =>
              "admin-navbar-link" + (isActive ? " admin-navbar-link-active" : "")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default AdminNavbar;
