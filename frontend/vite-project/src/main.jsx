import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { VoiceProvider } from "./pages/VoiceContext.jsx";

// Removed BrowserRouter from here since App.jsx already has it
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
