import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./components/UserDataContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
  </React.StrictMode>
);
