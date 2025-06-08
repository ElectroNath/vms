import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editEmployee, setEditEmployee] = useState({});
  const [creating, setCreating] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    full_name: "",
    department: "",
    position: "",
    staff_id: ""
  });

  const fetchEmployees = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/employees/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
      setError("");
    } catch (err) {
      setEmployees([]);
      setError("Failed to fetch employees.");
      console.error("Fetch employees error:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditEmployee({ ...emp });
  };

  const handleEditChange = (e) => {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${API_BASE_URL}/api/employees/${id}/`,
        editEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditEmployee({});
      fetchEmployees();
    } catch (err) {
      setError("Failed to update employee.");
      console.error("Update employee error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/api/employees/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee.");
      console.error("Delete employee error:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_BASE_URL}/api/employees/`,
        newEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewEmployee({ full_name: "", department: "", position: "", staff_id: "" });
      setCreating(false);
      fetchEmployees();
    } catch (err) {
      setError("Failed to create employee.");
      console.error("Create employee error:", err);
    }
  };

  return (
    <div className="admin-table-page">
      <h2>Employees</h2>
      <button onClick={() => setCreating(!creating)} style={{ marginBottom: 10 }}>
        {creating ? "Cancel" : "Add Employee"}
      </button>
      {creating && (
        <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
          <input
            name="full_name"
            value={newEmployee.full_name}
            onChange={e => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
            placeholder="Full Name"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="department"
            value={newEmployee.department}
            onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })}
            placeholder="Department"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="position"
            value={newEmployee.position}
            onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
            placeholder="Position"
            required
            style={{ marginRight: 8 }}
          />
          <input
            name="staff_id"
            value={newEmployee.staff_id}
            onChange={e => setNewEmployee({ ...newEmployee, staff_id: e.target.value })}
            placeholder="Staff ID"
            required
            style={{ marginRight: 8 }}
          />
          <button type="submit">Create</button>
        </form>
      )}
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Staff ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>
                {editingId === e.id ? (
                  <input
                    name="full_name"
                    value={editEmployee.full_name}
                    onChange={handleEditChange}
                  />
                ) : (
                  e.full_name
                )}
              </td>
              <td>
                {editingId === e.id ? (
                  <input
                    name="department"
                    value={editEmployee.department}
                    onChange={handleEditChange}
                  />
                ) : (
                  e.department
                )}
              </td>
              <td>
                {editingId === e.id ? (
                  <input
                    name="position"
                    value={editEmployee.position}
                    onChange={handleEditChange}
                  />
                ) : (
                  e.position
                )}
              </td>
              <td>
                {editingId === e.id ? (
                  <input
                    name="staff_id"
                    value={editEmployee.staff_id}
                    onChange={handleEditChange}
                  />
                ) : (
                  e.staff_id
                )}
              </td>
              <td>
                {editingId === e.id ? (
                  <>
                    <button onClick={() => handleUpdate(e.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(e)}>Edit</button>
                    <button onClick={() => handleDelete(e.id)}>Delete</button>
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

export default AdminEmployees;
