import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/employees/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch {
        setEmployees([]);
      }
    }
    fetchEmployees();
  }, []);
  return (
    <div className="admin-table-page">
      <h2>Employees</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Staff ID</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.full_name}</td>
              <td>{e.department}</td>
              <td>{e.position}</td>
              <td>{e.staff_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEmployees;
