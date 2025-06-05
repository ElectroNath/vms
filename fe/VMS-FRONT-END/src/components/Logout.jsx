import React from "react";
import Cookies from "js-cookie";

function Logout({ className = "", style = {}, children = "Logout" }) {
  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/"; // Redirect to login page after logout
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
