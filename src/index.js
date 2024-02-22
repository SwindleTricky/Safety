import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Navbarcomp from "./components/navbar";
import reportWebVitals from "./reportWebVitals";
import TestAPI from "./pages/testAPI";
import Login from "./pages/login";
import FormDetail from "./pages/form";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
setInterval(() => {
  if (localStorage.getItem("token")) {
    const EXPIRE_DATE = JSON.parse(localStorage.getItem("initEx")).expiresOn;
    if (Date.now() >= EXPIRE_DATE) {
      localStorage.clear();
      window.location.reload();
    }
  }
}, 1000 * 60 * 5 * 1); // 5 min per check

root.render(
  <React.StrictMode>
    <Navbarcomp />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/testAPI" element={<TestAPI />} />
        <Route path="/form" element={<FormDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
