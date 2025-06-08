import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminGuests() {
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editGuest, setEditGuest] = useState({});
  const [creating, setCreating] = useState(false);
  const [newGuest, setNewGuest] = useState({
    full_name: "",
    phone: "",
    purpose: "",
    invited_by_name: "",
    visit_date: "",
    is_verified: false,
  });

  const fetchGuests = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/guests/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(res.data);
      setError("");
    } catch (err) {
      setGuests([]);
      setError("Failed to fetch guests.");
      console.error("Fetch guests error:", err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleEdit = (guest) => {
    setEditingId(guest.id);
    setEditGuest({ ...guest });
  };

  const handleEditChange = (e) => {
    setEditGuest({ ...editGuest, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${API_BASE_URL}/api/guests/${id}/`,
        editGuest,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditGuest({});
      fetchGuests();
    } catch (err) {
      setError("Failed to update guest.");
      console.error("Update guest error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/api/guests/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGuests();
    } catch (err) {
      setError("Failed to delete guest.");
      console.error("Delete guest error:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_BASE_URL}/api/guests/`,
        newGuest,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGuest({
        full_name: "",
        phone: "",
        purpose: "",
        invited_by_name: "",
        visit_date: "",
        is_verified: false,
      });
      setCreating(false);
      fetchGuests();
    } catch (err) {
      setError("Failed to create guest.");
      console.error("Create guest error:", err);
    }
  };

  return (
    <div className="admin-table-page">
      <h2>Guests</h2>
      <button onClick={() => setCreating(!creating)} style={{ marginBottom: 10 }}>
        {creating ? "Cancel" : "Add Guest"}
      </button>
      {creating && (
        <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
          <input
            name="full_name"
            value={newGuest.full_name}
            onChange={e => setNewGuest({ ...newGuest, full_name: e.target.value })}
            placeholder="Full Name"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="phone"
            value={newGuest.phone}
            onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })}
            placeholder="Phone"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="purpose"
            value={newGuest.purpose}
            onChange={e => setNewGuest({ ...newGuest, purpose: e.target.value })}
            placeholder="Purpose"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="invited_by_name"
            value={newGuest.invited_by_name}
            onChange={e => setNewGuest({ ...newGuest, invited_by_name: e.target.value })}
            placeholder="Invited By"
            style={{ marginRight: 8 }}
          />
          <input
            name="visit_date"
            type="date"
            value={newGuest.visit_date}
            onChange={e => setNewGuest({ ...newGuest, visit_date: e.target.value })}
            style={{ marginRight: 8 }}
          />
          <label>
            Verified
            <input
              type="checkbox"
              checked={!!newGuest.is_verified}
              onChange={e => setNewGuest({ ...newGuest, is_verified: e.target.checked })}
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
            <th>Full Name</th>
            <th>Phone</th>
            <th>Purpose</th>
            <th>Invited By</th>
            <th>Visit Date</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map(g => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>
                {editingId === g.id ? (
                  <input
                    name="full_name"
                    value={editGuest.full_name}
                    onChange={handleEditChange}
                  />
                ) : (
                  g.full_name
                )}
              </td>
              <td>
                {editingId === g.id ? (
                  <input
                    name="phone"
                    value={editGuest.phone}
                    onChange={handleEditChange}
                  />
                ) : (
                  g.phone
                )}
              </td>
              <td>
                {editingId === g.id ? (
                  <input
                    name="purpose"
                    value={editGuest.purpose}
                    onChange={handleEditChange}
                  />
                ) : (
                  g.purpose
                )}
              </td>
              <td>
                {editingId === g.id ? (
                  <input
                    name="invited_by_name"
                    value={editGuest.invited_by_name}
                    onChange={handleEditChange}
                  />
                ) : (
                  g.invited_by_name
                )}
              </td>
              <td>
                {editingId === g.id ? (
                  <input
                    name="visit_date"
                    type="date"
                    value={editGuest.visit_date}
                    onChange={handleEditChange}
                  />
                ) : (
                  g.visit_date
                )}
              </td>
              <td>
                {editingId === g.id ? (
                  <input
                    type="checkbox"
                    checked={!!editGuest.is_verified}
                    onChange={e => setEditGuest({ ...editGuest, is_verified: e.target.checked })}
                  />
                ) : (
                  g.is_verified ? "Yes" : "No"
                )}
              </td>
              <td>
                {editingId === g.id ? (
                  <>
                    <button onClick={() => handleUpdate(g.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(g)}>Edit</button>
                    <button onClick={() => handleDelete(g.id)}>Delete</button>
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

export default AdminGuests;
