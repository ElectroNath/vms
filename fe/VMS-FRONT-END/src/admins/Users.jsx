import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "employee", is_active: true, password: "" });

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setError("");
    } catch (err) {
      setUsers([]);
      setError("Failed to fetch users.");
      console.error("Fetch users error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditUser({ ...user });
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${API_BASE_URL}/api/employees/${id}/`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditUser({});
      fetchUsers();
    } catch (err) {
      setError("Failed to update user.");
      console.error("Update user error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/api/employees/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
      console.error("Delete user error:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_BASE_URL}/api/employees/`,
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUser({ username: "", email: "", role: "employee", is_active: true, password: "" });
      setCreating(false);
      fetchUsers();
    } catch (err) {
      setError("Failed to create user.");
      console.error("Create user error:", err);
    }
  };

  return (
    <div className="admin-table-page">
      <h2>Users</h2>
      <button onClick={() => setCreating(!creating)} style={{ marginBottom: 10 }}>
        {creating ? "Cancel" : "Add User"}
      </button>
      {creating && (
        <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
          <input
            name="username"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            placeholder="Username"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            required
            style={{ marginRight: 8 }}
          />
          <select
            name="role"
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            style={{ marginRight: 8 }}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
            <option value="security">Security</option>
          </select>
          <input
            name="password"
            type="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Password"
            required
            style={{ marginRight: 8 }}
          />
          <label>
            Active
            <input
              type="checkbox"
              checked={newUser.is_active}
              onChange={e => setNewUser({ ...newUser, is_active: e.target.checked })}
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
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>
                {editingId === u.id ? (
                  <input
                    name="username"
                    value={editUser.username}
                    onChange={handleEditChange}
                  />
                ) : (
                  u.username
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <input
                    name="email"
                    value={editUser.email}
                    onChange={handleEditChange}
                  />
                ) : (
                  u.email
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <select
                    name="role"
                    value={editUser.role}
                    onChange={handleEditChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="security">Security</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <input
                    type="checkbox"
                    checked={!!editUser.is_active}
                    onChange={e => setEditUser({ ...editUser, is_active: e.target.checked })}
                  />
                ) : (
                  u.is_active ? "Yes" : "No"
                )}
              </td>
              <td>
                {editingId === u.id ? (
                  <>
                    <button onClick={() => handleUpdate(u.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u.id)}>Delete</button>
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

export default AdminUsers;
