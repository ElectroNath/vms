import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import InviteGuest from "./Pages/InviteGuest";
import AppRouter from "./components/AppRouter";
import ForgotPassword from "./Pages/ForgotPassword";
import "@fontsource/montserrat";
import "./styles/Home.css";

// App is now just a wrapper for Router and AppRouter
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<AppRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
