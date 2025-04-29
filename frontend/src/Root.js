
// --- Import Libraries ---
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// --- Import Pages ---
import Login from "./pages/Login"; // Will rename later to login.js(done)
import Register from "./pages/Register"; // Register page
import Home from "./pages/Home";
import Request from "./pages/Request";
import Tutorial from "./pages/Tutorial"
import Dashboard from "./pages/Dashboard";
// --- Root Component with Routing ---
function Root() {
    return (
        <Router>
            <Routes>
                {/* Route for Home Page */}
                <Route path="/" element={<Home />} />
                {/* Route for Register Page */}
                <Route path="/register" element={<Register />} />
                {/* Route for Login Page */}
                <Route path="/login" element={<Login />} />
                {/* Route for Request Page */}
                <Route path="/request" element={<Request />} />
                {/* Route for Tutorial Page */}
                <Route path="/tutorial" element={<Tutorial />} />
                {/* Route for Dashboard Page */}
                <Route path="/dashboard" element={<Dashboard />} />
                
            </Routes>
        </Router>
    );
}

// Export Root App
export default Root;
