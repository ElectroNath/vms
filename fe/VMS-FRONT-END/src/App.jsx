import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AppRouter from "./components/AppRouter";
import ForgotPassword from "./Pages/ForgotPassword";
import Messages from "./Pages/Messages";
import Admin from "./admins/Admin";
import Cookies from "js-cookie";
import "@fontsource/montserrat";
import "./styles/Home.css";
import Security from "./securities/Security";

// Error boundary for catching runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red", padding: 24 }}>Error: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

// App is now just a wrapper for Router and AppRouter
function App() {
  // Use state for user
  const [user, setUser] = useState(() => {
    try {
      const userCookie = Cookies.get("user");
      if (userCookie) return JSON.parse(userCookie);
    } catch {}
    return null;
  });

  // Listen for changes to the user cookie (e.g., after login)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const userCookie = Cookies.get("user");
        if (userCookie) {
          const parsed = JSON.parse(userCookie);
          if (JSON.stringify(parsed) !== JSON.stringify(user)) {
            setUser(parsed);
          }
        } else if (user) {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [user]);

  // Role-based root navigation
  function getRootRedirect() {
    if (user && user.role === "admin") return <Navigate to="/admin" replace />;
    if (user && user.role === "security") return <Navigate to="/security" replace />;
    if (user && user.role === "employee") return <Navigate to="/home" replace />;
    return <Navigate to="/login" replace />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {user && user.role ? (
            <>
              <Route path="/messages" element={<Messages />} />
              <Route
                path="/admin/*"
                element={
                  user.role === "admin" ? (
                    <Admin />
                  ) : user.role === "employee" ? (
                    <Navigate to="/home" replace />
                  ) : user.role === "security" ? (
                    <Navigate to="/security" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/security/*"
                element={
                  user.role === "security" ? (
                    <Security />
                  ) : user.role === "admin" ? (
                    <Navigate to="/admin" replace />
                  ) : user.role === "employee" ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/" element={getRootRedirect()} />
              <Route path="/*" element={<AppRouter />} />
            </>
          ) : (
            // If not authenticated, redirect all other routes to login
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
