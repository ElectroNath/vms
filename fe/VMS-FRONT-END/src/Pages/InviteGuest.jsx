import React, { useState } from "react";

function InviteGuest() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    purpose: "",
    visitDate: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // You can handle form submission here
    alert("Guest invitation submitted!");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", background: "#fff", padding: 24, borderRadius: 10, boxShadow: "0 2px 8px #eee" }}>
      <h2>Invite Guest</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Purpose</label>
          <input
            type="text"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Visit Date</label>
          <input
            type="date"
            name="visitDate"
            value={form.visitDate}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 24px", background: "#247150", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default InviteGuest;
