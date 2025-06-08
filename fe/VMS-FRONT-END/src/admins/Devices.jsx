import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminDevices() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDevice, setEditDevice] = useState({});
  const [creating, setCreating] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_name: "",
    serial_number: "",
    owner_employee_name: "",
    owner_guest_name: "",
    is_verified: false,
  });

  const fetchDevices = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/devices/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(res.data);
      setError("");
    } catch (err) {
      setDevices([]);
      setError("Failed to fetch devices.");
      console.error("Fetch devices error:", err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleEdit = (device) => {
    setEditingId(device.id);
    setEditDevice({ ...device });
  };

  const handleEditChange = (e) => {
    setEditDevice({ ...editDevice, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${API_BASE_URL}/api/devices/${id}/`,
        editDevice,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditDevice({});
      fetchDevices();
    } catch (err) {
      setError("Failed to update device.");
      console.error("Update device error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/api/devices/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDevices();
    } catch (err) {
      setError("Failed to delete device.");
      console.error("Delete device error:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_BASE_URL}/api/devices/`,
        newDevice,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewDevice({
        device_name: "",
        serial_number: "",
        owner_employee_name: "",
        owner_guest_name: "",
        is_verified: false,
      });
      setCreating(false);
      fetchDevices();
    } catch (err) {
      setError("Failed to create device.");
      console.error("Create device error:", err);
    }
  };

  return (
    <div className="admin-table-page">
      <h2>Devices</h2>
      <button onClick={() => setCreating(!creating)} style={{ marginBottom: 10 }}>
        {creating ? "Cancel" : "Add Device"}
      </button>
      {creating && (
        <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
          <input
            name="device_name"
            value={newDevice.device_name}
            onChange={e => setNewDevice({ ...newDevice, device_name: e.target.value })}
            placeholder="Device Name"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="serial_number"
            value={newDevice.serial_number}
            onChange={e => setNewDevice({ ...newDevice, serial_number: e.target.value })}
            placeholder="Serial Number"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="owner_employee_name"
            value={newDevice.owner_employee_name}
            onChange={e => setNewDevice({ ...newDevice, owner_employee_name: e.target.value })}
            placeholder="Owner Employee Name"
            style={{ marginRight: 8 }}
          />
          <input
            name="owner_guest_name"
            value={newDevice.owner_guest_name}
            onChange={e => setNewDevice({ ...newDevice, owner_guest_name: e.target.value })}
            placeholder="Owner Guest Name"
            style={{ marginRight: 8 }}
          />
          <label>
            Verified
            <input
              type="checkbox"
              checked={!!newDevice.is_verified}
              onChange={e => setNewDevice({ ...newDevice, is_verified: e.target.checked })}
              style={{ marginLeft: 4, marginRight: 8 }}
            />
          </label>
          <button type="submit">Create</button>
        </form>
      )}
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Device Name</th>
            <th>Serial Number</th>
            <th>Owner</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>
                {editingId === d.id ? (
                  <input
                    name="device_name"
                    value={editDevice.device_name}
                    onChange={handleEditChange}
                  />
                ) : (
                  d.device_name
                )}
              </td>
              <td>
                {editingId === d.id ? (
                  <input
                    name="serial_number"
                    value={editDevice.serial_number}
                    onChange={handleEditChange}
                  />
                ) : (
                  d.serial_number
                )}
              </td>
              <td>
                {editingId === d.id ? (
                  <>
                    <input
                      name="owner_employee_name"
                      value={editDevice.owner_employee_name || ""}
                      onChange={handleEditChange}
                      placeholder="Owner Employee"
                      style={{ marginRight: 4 }}
                    />
                    <input
                      name="owner_guest_name"
                      value={editDevice.owner_guest_name || ""}
                      onChange={handleEditChange}
                      placeholder="Owner Guest"
                    />
                  </>
                ) : (
                  d.owner_employee_name || d.owner_guest_name
                )}
              </td>
              <td>
                {editingId === d.id ? (
                  <input
                    type="checkbox"
                    checked={!!editDevice.is_verified}
                    onChange={e => setEditDevice({ ...editDevice, is_verified: e.target.checked })}
                  />
                ) : (
                  d.is_verified ? "Yes" : "No"
                )}
              </td>
              <td>
                {editingId === d.id ? (
                  <>
                    <button onClick={() => handleUpdate(d.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(d)}>Edit</button>
                    <button onClick={() => handleDelete(d.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDevices;
