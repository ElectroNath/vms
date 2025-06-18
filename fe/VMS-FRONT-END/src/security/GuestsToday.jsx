import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";

function SecurityGuestsToday() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGuests = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const today = new Date().toISOString().slice(0, 10);
        const res = await axios.get(`${API_BASE_URL}/api/security/guests/?date=${today}`,
          { headers: { Authorization: `Bearer ${token}` } });
        setGuests(res.data || []);
      } catch (e) {
        setError("Failed to fetch guests for today.");
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  return (
    <div className="admin-table-page" style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Guests Arriving Today</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "#c00" }}>{error}</div>
      ) : (
        <table className="admin-table" style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Purpose</th>
              <th>Visit Date</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "#888" }}>No guests for today.</td></tr>
            ) : (
              guests.map(g => (
                <tr key={g.id}>
                  <td>{g.full_name}</td>
                  <td>{g.phone}</td>
                  <td>{g.purpose}</td>
                  <td>{g.visit_date}</td>
                  <td>{g.is_verified ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SecurityGuestsToday;
