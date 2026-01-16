
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlayerProvider } from "./context/PlayerContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
