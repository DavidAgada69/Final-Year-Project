// --- Import Libraries ---
import React, { useState } from "react";
import { auth } from "./firebase";  // Firebase authentication
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

// --- Define App Component ---
function Login() {
    // --- State Hooks ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); // Hook for navigation
    // --- Handle Login Submission ---
    async function handleLogin(event) {
        event.preventDefault();
        try {
            // --- Firebase Login ---
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();

            console.log('Login successful (Firebase):', idToken);

            // --- Send Token to Backend ---
            const backendResponse = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_token: idToken
                })
            });

            const backendData = await backendResponse.json();

            if (backendResponse.ok) {
                console.log('Backend login successful:', backendData);
                setMessage('Login successful!');
                navigate("/"); // Redirect to homepage
            } else {
                console.error('Backend login failed:', backendData);
                setMessage('Backend login failed: ' + backendData.detail);
            }

        } catch (error) {
            console.error('Error during login:', error);
            setMessage('An unexpected error occurred: ' + error.message);
        }
    }

    // --- Render UI ---
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

// --- Export App Component ---
export default Login;