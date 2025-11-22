import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { VoiceProvider } from "./pages/VoiceContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <VoiceProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </VoiceProvider>
);
