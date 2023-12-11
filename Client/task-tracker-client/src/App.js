import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Components/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Tasks from "./Components/Tasks";

import "./Styles/App.css";

function App() {
  return (
    <>
      <Header />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home /> } />

          <Route path="/Tasks" element={<Tasks />} />

          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          {/* <Route path="*" element={<Error />} /> */}
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
