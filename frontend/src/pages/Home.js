import React from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Home.css";
// --- Homepage Component ---//
function Home() {
    const navigate = useNavigate();// Hook for navigation

    // --- Navigate to Selected page ---
    function goTo(path) {
        navigate(path);
    }

    return (
        <div className="home-container">
            <h1 className="home-title"> Welcome to D.net Office Builder</h1>
            <div className="home button-container">
                <button className="home-button" onClick={() => goTo("/request")}>
                    Submit Server Request
                </button>
                <button className="home-button" onClick={() => goTo("/tutorial")}>
                    View Tutorials
                </button>
                <button className="home-button" onClick={() => goTo("/dashboard")}>
                    Manage My Account
                </button>
            </div>
        </div>
    );
}

// --- Export Home Page ---
export default Home;