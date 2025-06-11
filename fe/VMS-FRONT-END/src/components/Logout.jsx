import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Logout({ className = "", style = {}, children = "Logout" }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/login"; // Force full reload to update app state
  };

  return (
    <div
      className={className}
      style={style}
      onClick={handleLogout}
      role="button"
      tabIndex={0}
      onKeyPress={e => { if (e.key === "Enter") handleLogout(); }}
    >
      {children}
    </div>
  );
}

export default Logout;
