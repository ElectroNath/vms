import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";
import "../styles/Admin.css";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_BASE_URL}/api/messages/`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchMessages();
    } catch (err) {
      setError("Failed to create message.");
      console.error("Create message error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/api/messages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMessages();
    } catch (err) {
      setError("Failed to delete message.");
      console.error("Delete message error:", err);
    }
  };

  const handleEdit = (id, currentContent) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  const handleUpdate = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${API_BASE_URL}/api/messages/${id}/`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditContent("");
      fetchMessages();
    } catch (err) {
      setError("Failed to update message.");
      console.error("Update message error:", err);
    }
  };

  return (
    <div className="admin-table-page">
      <h2>Messages</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="New message"
          style={{ width: 300, marginRight: 10 }}
        />
        <button type="submit">Add Message</button>
        {error && <span style={{ color: "red", marginLeft: 10 }}>{error}</span>}
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Content</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.sender_username}</td>
              <td>
                {editingId === m.id ? (
                  <input
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    style={{ width: 200 }}
                  />
                ) : (
                  m.content
                )}
              </td>
              <td>{new Date(m.created_at).toLocaleString()}</td>
              <td>
                {editingId === m.id ? (
                  <>
                    <button onClick={() => handleUpdate(m.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(m.id, m.content)}>Edit</button>
                    <button onClick={() => handleDelete(m.id)}>Delete</button>
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

export default AdminMessages;
