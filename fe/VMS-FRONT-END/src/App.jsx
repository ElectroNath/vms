import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AppRouter from "./components/AppRouter";
import ForgotPassword from "./Pages/ForgotPassword";
import Messages from "./Pages/Messages";
import Admin from "./admins/Admin";
import SecurityRoutes from "./security/index.jsx";
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

  // Role-based root navigation
  function getRootRedirect() {
    if (user && user.role === "admin") return <Navigate to="/admin" replace />;
    if (user && user.role === "security") return <Navigate to="/security" replace />;
    if (user && user.role === "employee") return <Navigate to="/home" replace />;
    return <Navigate to="/login" replace />;
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
            ) : user && user.role === "employee" ? (
              <Navigate to="/home" replace />
            ) : user && user.role === "security" ? (
              <Navigate to="/security" replace />
            ) : (
              <>
                {console.error("App.jsx: Unauthorized admin route access. User:", user)}
                <Navigate to="/login" replace />
              </>
            )
          }
        />
        <Route
          path="/security/*"
          element={
            user && user.role === "security" ? (
              <SecurityRoutes />
            ) : user && user.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : user && user.role === "employee" ? (
              <Navigate to="/home" replace />
            ) : (
              <>
                {console.error("App.jsx: Unauthorized security route access. User:", user)}
                <Navigate to="/login" replace />
              </>
            )
          }
        />
        <Route path="/" element={getRootRedirect()} />
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
