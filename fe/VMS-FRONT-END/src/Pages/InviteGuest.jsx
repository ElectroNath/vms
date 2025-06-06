import React, { useState } from "react";
import axios from "axios";
import "../styles/Form.css";
import { API_BASE_URL } from "../api";
import Cookies from "js-cookie";

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
        const res = await axios.get(
          `${API_BASE_URL}/api/employee-profiles/me/`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        // Try to get user.id from nested user object, fallback to id
        let userId = null;
        if (res.data) {
          if (res.data.user && res.data.user.id) {
            userId = res.data.user.id;
          } else if (res.data.id) {
            userId = res.data.id;
          }
        }
        if (userId !== undefined && userId !== null && userId !== "") {
          setForm(f => ({ ...f, id: String(userId) }));
        } else {
          setError("Could not determine your user ID. Please re-login.");
        }
      } catch (e) {
        setError("Could not determine your user ID. Please re-login.");
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
      await axios.post(
        `${API_BASE_URL}/api/guests/`,
        {
          id: form.id, // send user id as 'id'
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          purpose: form.purpose,
          visit_date: form.visitDate,
        },
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
        id: form.id, // keep id for next submission
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.response && err.response.data) {
        const firstError = Object.values(err.response.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError("Failed to submit invitation. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-root">
      <div className="form-container" style={{ minWidth: 700, maxWidth: 1100 }}>
        <div className="login-form-title" style={{ marginBottom: 32, textAlign: "left" }}>
          Invite Guest
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}
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
          <input type="hidden" name="id" value={form.id || ""} />
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InviteGuest;
