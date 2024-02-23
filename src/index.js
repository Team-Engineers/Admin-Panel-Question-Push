import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GeneralContextProvider } from "./context/GeneralContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GeneralContextProvider>
        <App />
      </GeneralContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
