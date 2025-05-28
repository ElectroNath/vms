import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/employee-profiles/me/",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
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
