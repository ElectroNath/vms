import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function fetchMessages() {
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${API_BASE_URL}/api/admin/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch {
        setMessages([]);
      }
    }
    fetchMessages();
  }, []);
  return (
    <div className="admin-table-page">
      <h2>Messages</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Content</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.sender_username}</td>
              <td>{m.content}</td>
              <td>{new Date(m.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMessages;
