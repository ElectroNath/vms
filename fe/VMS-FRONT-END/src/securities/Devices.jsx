import React, { useEffect, useState } from "react";
import SecurityNavbar from "./SecurityNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";
import "../styles/Login.css";
import "../styles/AdminUser.css";
import Modal from "../components/Modals";
import ReactDOM from "react-dom";

// Special QR modal using React Portal
function QRCodeModal({ url, onClose }) {
  if (!url) return null;
  return ReactDOM.createPortal(
    <div
      className="qr-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="qr-modal-content"
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "32px 24px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
          textAlign: "center",
          minWidth: 320,
        }}
      >
        <h3 style={{ marginBottom: 18 }}>Device QR Code</h3>
        <img
          src={url}
          alt="QR Code"
          style={{
            width: "220px",
            height: "220px",
            marginBottom: 16,
            borderRadius: 8,
            boxShadow: "0 2px 8px #eee",
          }}
        />
        <div style={{ marginBottom: 18 }}>
          <button
            style={{
              background: "#1bb76e",
              color: "#fff",
              border: "none",
              padding: "8px 24px",
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
        <button
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            padding: "8px 24px",
            borderRadius: 6,
            fontWeight: 500,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}

function SecurityDevices() {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_name: "",
    serial_number: "",
    owner_employee: "",
    owner_guest: "",
    qr_code: "",
    is_verified: false,
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [error, setError] = useState("");
  const [qrModal, setQrModal] = useState({ open: false, url: "" });
  const [editingId, setEditingId] = useState(null);
  const [editDevice, setEditDevice] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState({
    device_name: "",
    serial_number: "",
    owner: "",
    is_verified: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

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
      setDevices(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Device fetch error:", err);
      setDevices([]);
    }
  };

  const fetchEmployeeList = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/security/employees/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeList(
        Array.isArray(res.data) ? res.data : res.data.results || []
      );
    } catch (err) {
      console.warn("Cannot fetch employee list: forbidden for this role.");
      setEmployeeList([]); // fallback to empty list
    }
  };

  const fetchGuestList = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/security/guests/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuestList(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch {
      setGuestList([]);
    }
  };

  // Change: showModal should control the create modal, not be set in handleCreate
  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      const token = Cookies.get("token");
      await axios.post(`${API_BASE_URL}/api/security/devices/`, newDevice, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Failed to create device."
      );
    }
  };

  // Edit modal handlers
  const handleEdit = (device) => {
    setEditingId(device.id);
    setEditDevice({ ...device });
    setShowEditModal(true);
  };
  const handleEditModalClose = () => {
    setEditingId(null);
    setEditDevice({});
    setShowEditModal(false);
  };
  const handleEditChange = (e) => {
    setEditDevice({ ...editDevice, [e.target.name]: e.target.value });
  };
  const handleUpdate = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${API_BASE_URL}/api/security/devices/${id}/`,
        editDevice,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditDevice({});
      setShowEditModal(false);
      fetchDevices();
    } catch (err) {
      setError("Failed to update device.");
    }
  };

  // Delete modal handlers
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/api/security/devices/${deleteId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchDevices();
    } catch (err) {
      setError("Failed to delete device.");
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Filtering and pagination
  const filteredDevices = devices.filter(
    (d) =>
      (filter.device_name === "" ||
        d.device_name
          ?.toLowerCase()
          .includes(filter.device_name.toLowerCase())) &&
      (filter.serial_number === "" ||
        d.serial_number
          ?.toLowerCase()
          .includes(filter.serial_number.toLowerCase())) &&
      (filter.owner === "" ||
        (d.owner_employee &&
          d.owner_employee
            .toLowerCase()
            .includes(filter.owner.toLowerCase())) ||
        (d.owner_guest &&
          d.owner_guest.toLowerCase().includes(filter.owner.toLowerCase()))) &&
      (filter.is_verified === "" ||
        (filter.is_verified === "verified" ? d.is_verified : !d.is_verified))
  );
  const paginatedDevices = filteredDevices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, device_name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      serial_number: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      owner_employee: e.target.value,
                    })
                  }
                >
                  <option value="">Select Employee</option>
                  {employeeList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name}
                    </option>
                  ))}
                </select>
                <span className="login-input-label">Owner Employee</span>
              </div>
              <div className="login-input-group">
                <select
                  className="login-input"
                  name="owner_guest"
                  value={newDevice.owner_guest}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, owner_guest: e.target.value })
                  }
                >
                  <option value="">Select Guest</option>
                  {guestList.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.full_name}
                    </option>
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
                    onChange={(e) =>
                      setNewDevice({
                        ...newDevice,
                        is_verified: e.target.checked,
                      })
                    }
                  />
                </label>
              </div>
              <div className="adminuser-modal-btn-row">
                <button
                  type="submit"
                  className="login-btn adminuser-create-btn"
                >
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
          {Array.isArray(devices) &&
            devices.map((d) => (
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
