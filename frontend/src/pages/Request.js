// src/pages/Request.js
import React, { useState } from "react";
import axios from "axios";
import { auth } from "./firebase"; // Your existing Firebase config
import { getIdToken } from "firebase/auth";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";

function Request() {
    const [companyName, setCompanyName] = useState("");
    const [details, setDetails] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const user = auth.currentUser;
            if (!user) {
                setError("You must be logged in to submit a request.");
                return;
            }

            const token = await getIdToken(user);

            const response = await axios.post(
                "http://localhost:8000/api/request",
                {
                    company_name: companyName,
                    details: details,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);

            setMessage("Request submitted successfully.");
            setCompanyName("");
            setDetails("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Something went wrong.");
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                Submit a Server Request
            </Typography>

            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Company Name"
                    fullWidth
                    margin="normal"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />

                <TextField
                    label="Project Details"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit Request
                </Button>
            </form>
        </Box>
    );
}

export default Request;
