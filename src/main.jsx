import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Import BrowserRouter
import App from "./App";
import "./index.css";
import "antd/dist/reset.css"
import { Buffer } from 'buffer';
import process from 'process';
import * as util from 'util';
import { Provider } from "react-redux";
import store from "./Pages/redux/store";

globalThis.Buffer = Buffer;
globalThis.process = process;
globalThis.util = util;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>  
      <App />  {/*  App should be inside BrowserRouter */}
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
