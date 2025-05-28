import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/employee-profiles/",
          {
            withCredentials: true, // send cookie for authentication
          }
        );
        setUsername(response.data.username); // adjust this key if your backend returns a different field
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>WELCOME TO NNPC VISITOR MANAGEMENT SYSTEM</h1>
      {username && <h2>Welcome to NETCO, {username}!</h2>}
    </div>
  );
}

export default Home;
