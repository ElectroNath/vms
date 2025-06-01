import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";

function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = Cookies.get("token");
        console.log("Token in cookie:", token);

        const response = await axios.get(
          `${API_BASE_URL}/api/employee-profiles/me/`,
          {
            withCredentials: true,
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
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
    <div>
      <h1>WELCOME TO NNPC VISITOR MANAGEMENT SYSTEM</h1>
      {username && <h2>Hello, {username}!</h2>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Home;
