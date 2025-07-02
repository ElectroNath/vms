import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";
import "../styles/Login.css";
import "../styles/AdminUser.css";

function SecurityDevices() {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_name: "",
    serial_number: "",
    owner_employee: "",
    owner_guest: "",
    is_verified: false,
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDevices();
    fetchEmployeeList();
    fetchGuestList();
  }, []);

  const fetchDevices = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/security/devices/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(res.data);
    } catch {
      setDevices([]);
    }
  };

  const fetchEmployeeList = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/employees/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeList(res.data);
    } catch {
      setEmployeeList([]);
    }
  };

  const fetchGuestList = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/guests/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuestList(res.data);
    } catch {
      setGuestList([]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_BASE_URL}/api/security/devices/`,
        newDevice,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setNewDevice({
        device_name: "",
        serial_number: "",
        owner_employee: "",
        owner_guest: "",
        is_verified: false,
      });
      fetchDevices();
    } catch (err) {
      setError("Failed to create device.");
    }
  };

  return (
    <div className="admin-table-page">
      <h2>Register Device</h2>
      <button onClick={() => setShowModal(true)} className="adminuser-add-btn">
        Register Device
      </button>
      {showModal && (
        <div className="qr-modal-overlay adminuser-modal-overlay">
          <div className="qr-modal-content adminuser-modal-content">
            <div className="adminuser-modal-title">Register Device</div>
            <form onSubmit={handleCreate} className="adminuser-modal-form">
              <div className="login-input-group">
                <input
                  className="login-input"
                  name="device_name"
                  value={newDevice.device_name}
                  onChange={e => setNewDevice({ ...newDevice, device_name: e.target.value })}
                  placeholder=" "
                  required
                />
                <span className="login-input-label">Device Name</span>
              </div>
              <div className="login-input-group">
                <input
                  className="login-input"
                  name="serial_number"
                  value={newDevice.serial_number}
                  onChange={e => setNewDevice({ ...newDevice, serial_number: e.target.value })}
                  placeholder=" "
                  required
                />
                <span className="login-input-label">Serial Number</span>
              </div>
              <div className="login-input-group">
                <select
                  className="login-input"
                  name="owner_employee"
                  value={newDevice.owner_employee}
                  onChange={e => setNewDevice({ ...newDevice, owner_employee: e.target.value })}
                >
                  <option value="">Select Employee</option>
                  {employeeList.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                  ))}
                </select>
                <span className="login-input-label">Owner Employee</span>
              </div>
              <div className="login-input-group">
                <select
                  className="login-input"
                  name="owner_guest"
                  value={newDevice.owner_guest}
                  onChange={e => setNewDevice({ ...newDevice, owner_guest: e.target.value })}
                >
                  <option value="">Select Guest</option>
                  {guestList.map(guest => (
                    <option key={guest.id} value={guest.id}>{guest.full_name}</option>
                  ))}
                </select>
                <span className="login-input-label">Owner Guest</span>
              </div>
              <div className="adminuser-checkbox-row">
                <label>
                  Verified
                  <input
                    type="checkbox"
                    checked={newDevice.is_verified}
                    onChange={e => setNewDevice({ ...newDevice, is_verified: e.target.checked })}
                  />
                </label>
              </div>
              <div className="adminuser-modal-btn-row">
                <button type="submit" className="login-btn adminuser-create-btn">
                  Register
                </button>
                <button
                  type="button"
                  className="login-btn adminuser-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
              {error && <div className="login-error">{error}</div>}
            </form>
          </div>
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Device Name</th>
            <th>Serial Number</th>
            <th>Owner Employee</th>
            <th>Owner Guest</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d.id}>
              <td>{d.device_name}</td>
              <td>{d.serial_number}</td>
              <td>{d.owner_employee_name}</td>
              <td>{d.owner_guest_name}</td>
              <td>{d.is_verified ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SecurityDevices;
