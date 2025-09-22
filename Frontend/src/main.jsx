import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./utils/ThemeContext";
import App from "./App";
import AuthProvider from "./components/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
      <App />
  </ThemeProvider>

  // </React.StrictMode>
);
