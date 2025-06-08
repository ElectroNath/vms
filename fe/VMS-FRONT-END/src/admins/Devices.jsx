import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminDevices() {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    async function fetchDevices() {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/devices/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDevices(res.data);
      } catch {
        setDevices([]);
      }
    }
    fetchDevices();
  }, []);
  return (
    <div className="admin-table-page">
      <h2>Devices</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Device Name</th>
            <th>Serial Number</th>
            <th>Owner</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.device_name}</td>
              <td>{d.serial_number}</td>
              <td>{d.owner_employee_name || d.owner_guest_name}</td>
              <td>{d.is_verified ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDevices;
