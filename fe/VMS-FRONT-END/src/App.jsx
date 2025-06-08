import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import InviteGuest from "./Pages/InviteGuest";
import AppRouter from "./components/AppRouter";
import ForgotPassword from "./Pages/ForgotPassword";
import Messages from "./Pages/Messages";
import Admin from "./admins/Admin";
import Cookies from "js-cookie";
import "@fontsource/montserrat";
import "./styles/Home.css";

// App is now just a wrapper for Router and AppRouter
function App() {
  // Get user from cookie (assume user info is stored as JSON string in 'user' cookie)
  let user = {};
  try {
    const userCookie = Cookies.get("user");
    if (userCookie) user = JSON.parse(userCookie);
  } catch {
    user = {};
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/messages" element={<Messages />} />
        <Route
          path="/admin/*"
          element={
            user && user.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Only redirect root "/" to /admin if admin, otherwise let AppRouter handle all other routes */}
        <Route
          path="/"
          element={
            user && user.role === "admin"
              ? <Navigate to="/admin" replace />
              : <Navigate to="/home" replace />
          }
        />
        {/* All other routes handled by AppRouter (for employees and others) */}
        <Route path="*" element={<AppRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
