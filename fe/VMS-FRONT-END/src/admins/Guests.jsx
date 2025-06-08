import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminGuests() {
  const [guests, setGuests] = useState([]);
  useEffect(() => {
    async function fetchGuests() {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/guests/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGuests(res.data);
      } catch {
        setGuests([]);
      }
    }
    fetchGuests();
  }, []);
  return (
    <div className="admin-table-page">
      <h2>Guests</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Purpose</th>
            <th>Invited By</th>
            <th>Visit Date</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {guests.map(g => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.full_name}</td>
              <td>{g.phone}</td>
              <td>{g.purpose}</td>
              <td>{g.invited_by_name}</td>
              <td>{g.visit_date}</td>
              <td>{g.is_verified ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminGuests;
