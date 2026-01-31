import "@fontsource/inter/latin.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { UpgradeProvider } from "./context/UpgradeContext.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UpgradeProvider>
        <App />
      </UpgradeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
