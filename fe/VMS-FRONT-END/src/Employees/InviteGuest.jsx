import React, { useState } from "react";
import axios from "axios";
import "../styles/Form.css";
import { API_BASE_URL } from "../api";
import Cookies from "js-cookie";
import Modal from "../components/Modals";

function InviteGuest() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    purpose: "",
    visitDate: "",
    id: "", // user id
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user id on mount (from user profile API)
  React.useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("You are not authenticated. Please log in.");
          return;
        }
        // Get the correct user PK for invited_by: must match the PK of the User model in your backend
        // Most likely, your backend expects the employee profile PK, not the user PK!
        // So use the employee profile id (res.data.id)
        let profileId = null;
        let res = null;
        try {
          res = await axios.get(
            `${API_BASE_URL}/api/employee-profiles/me/`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        } catch (e) {
          // ignore
        }
        if (res && res.data && res.data.id) {
          // Use the employee profile primary key (id) for invited_by
          setForm(f => ({ ...f, invited_by: String(res.data.id) }));
          setError(""); // clear error if profile id is found
        } else {
          setError("Could not determine your employee profile ID. Please contact admin.");
        }
      } catch (e) {
        setError("Could not determine your employee profile ID. Please contact admin.");
      }
    };
    fetchUserId();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simple validation
    if (!form.fullName || !form.email || !form.phone || !form.purpose || !form.visitDate) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    // Email validation
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    // Phone validation (basic)
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      // Ensure all fields are present and correct type
      const payload = {
        full_name: form.fullName?.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim(),
        purpose: form.purpose?.trim(),
        visit_date: form.visitDate,
        invited_by: form.invited_by ? Number(form.invited_by) : undefined,
      };
      // Remove undefined fields (for safety)
      Object.keys(payload).forEach(
        key => (payload[key] === undefined || payload[key] === "") && delete payload[key]
      );
      // The backend should be responsible for transactional integrity:
      // If any error occurs (including email sending), the guest should NOT be created in the database.
      // This is best enforced in the backend using atomic transactions.
      await axios.post(
        `${API_BASE_URL}/api/guests/`,
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json"
          },
        }
      );
      setSuccess("Guest invitation submitted successfully!");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        purpose: "",
        visitDate: "",
        invited_by: form.invited_by,
      });
    } catch (err) {
      // If any error occurs (including backend errors like email sending),
      // the guest will NOT be created in the database if the backend is correct.
      // Show all validation errors from backend
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object" && !Array.isArray(data)) {
          // Collect all error messages
          const messages = Object.entries(data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join(" | ");
          setError(messages);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Failed to submit invitation. Please try again.");
        }
      } else {
        setError("Failed to submit invitation. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-root">
      {/* Navbar removed: now handled globally for employee pages */}
      <div className="form-container" style={{ minWidth: 700, maxWidth: 1100 }}>
        <div className="login-form-title" style={{ marginBottom: 30, textAlign: "left" }}>
          Invite Guest
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {(error || success) && (
            <Modal
              message={error || success}
              isSuccess={!!success}
              onClose={() => {
                setError("");
                setSuccess("");
              }}
            />
          )}
          <div className="login-input-group">
            <input
              className="login-input"
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="off"
              placeholder=" "
              required
            />
            <span className="login-input-label">Full Name</span>
          </div>
          <div className="login-input-group">
            <input
              className="login-input"
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              placeholder=" "
              required
            />
            <span className="login-input-label">Email</span>
          </div>
          <div className="login-input-group">
            <input
              className="login-input"
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              autoComplete="off"
              placeholder=" "
              required
            />
            <span className="login-input-label">Phone</span>
          </div>
          <div className="login-input-group">
            <input
              className="login-input"
              type="text"
              id="purpose"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              autoComplete="off"
              placeholder=" "
              required
            />
            <span className="login-input-label">Purpose</span>
          </div>
          <div className="login-input-group">
            <input
              className="login-input"
              type="date"
              id="visitDate"
              name="visitDate"
              value={form.visitDate}
              onChange={handleChange}
              autoComplete="off"
              placeholder=" "
              required
            />
            <span className="login-input-label">Visit Date</span>
          </div>
          {/* Remove id hidden input */}
          <input type="hidden" name="invited_by" value={form.invited_by || ""} />
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InviteGuest;
