// --- Import Libraries ---
import React, { useState } from "react";
import { auth } from "./firebase"; // Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// --- Register Component ---
function Register() {
    // --- State Variables ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); // Hook to navigate programmatically

    // --- Handle Registeration Logic ---
    async function handleRegister(event) {
        event.preventDefault(); // prevent page reload when form is submitted
        try {
            // Create user with email and password using Firebase
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage("Registration successful");

            // Redirect to login page after successful registration
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Error: " + error.message);
        }
    }

    // --- Render Reguster Form ---
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br /><br />
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Register;