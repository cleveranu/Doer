import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import FirstPage from "./components/firstPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<FirstPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
