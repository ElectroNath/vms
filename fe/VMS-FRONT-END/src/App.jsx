import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import InviteGuest from "./Pages/InviteGuest";
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
            ) : (
              <>
                {console.error("App.jsx: Unauthorized security route access. User:", user)}
                <Navigate to="/login" replace />
              </>
            )
          }
        />
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
