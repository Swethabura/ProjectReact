import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // ✅ Import BrowserRouter
import App from "./App";
import "./index.css";
import "antd/dist/reset.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>  
      <App />  {/* ✅ App should be inside BrowserRouter */}
    </BrowserRouter>
  </React.StrictMode>
);

