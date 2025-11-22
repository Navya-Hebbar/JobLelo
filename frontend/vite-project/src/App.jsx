import React from "react";
import { Routes, Route } from "react-router-dom";
import UserReg from "./pages/UserReg";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserReg/>} />
      <Route path="/login" element={<Login/>} /> 
      <Route path="/home" element={<Home/>} /> 
    </Routes>
  );
};

export default App;
