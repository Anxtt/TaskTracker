import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Components/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Tasks from "./Components/Tasks";
import About from "./Components/About";
import AddTask from "./Components/AddTask";
import Error from "./Components/Error";

import "./Styles/App.css";

export default function App() {
    return (
        <>
            <Header className="mx-auto" />

            <div className="container mx-auto">
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/Tasks" element={<Tasks />} />
                    <Route path="/AddTask" element={<AddTask />} />

                    <Route path="/About" element={<About />} />

                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />

                    <Route path="*" element={<Error />} />
                </Routes>
            </div>

            <Footer className="mx-auto" />
        </>
    );
}
