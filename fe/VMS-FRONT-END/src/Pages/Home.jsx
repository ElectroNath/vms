import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../styles/Home.css";

function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/employee-profiles/me/",
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (response.data.username) {
          setUsername(response.data.username);
          setError("");
        } else {
          throw new Error("Username not found.");
        }
      } catch (error) {
        setUsername("");
        setError("Unable to fetch username. Please log in again.");
      }
    };
    fetchUsername();
  }, []);

  return (
    <div className="home-root">
      {/* Sidebar */}
      <div className="home-sidebar">
        {/* Avatar and Welcome */}
        <div className="home-sidebar-header">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="avatar"
            className="home-avatar"
          />
          <div className="home-welcome">
            WELCOME {username ? username.toUpperCase() : "{USER}"}
          </div>
        </div>
        {/* Menu */}
        <div className="home-menu">
          <div className="home-menu-item home-menu-item-active">Home</div>
          <div className="home-menu-item">Register Staff</div>
          <div className="home-menu-item">Invite Guest</div>
          <div className="home-menu-item">Register Devices</div>
        </div>
      </div>
      {/* Main Content */}
      <div className="home-main">
        <div className="home-main-title">HOME</div>
      </div>
    </div>
  );
}

export default Home;
