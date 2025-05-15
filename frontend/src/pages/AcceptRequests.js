// frontend/src/pages/AcceptRequests.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

function AcceptRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    const fetchRequests = async () => {
        try {
            const token = await getAuth().currentUser.getIdToken();
            const response = await axios.get("http://localhost:8000/api/requests", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
        } catch (error) {
            console.error(error);
            setSnack({ open: true, message: "Failed to fetch requests", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            const token = await getAuth().currentUser.getIdToken();
            await axios.patch(`http://localhost:8000/api/requests/${requestId}/accept`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRequests(prev => prev.filter(r => r.id !== requestId));
            setSnack({ open: true, message: "Request accepted", severity: "success" });
        } catch (error) {
            console.error(error);
            setSnack({ open: true, message: "Failed to accept request", severity: "error" });
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Available Server Requests</Typography>
            {loading ? <CircularProgress /> : (
                requests.length === 0 ? (
                    <Typography>No unaccepted requests available.</Typography>
                ) : (
                    requests.map((req) => (
                        <Card key={req.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{req.company_name}</Typography>
                                <Typography>{req.details}</Typography>
                                <Typography variant="body2" color="text.secondary">Submitted: {new Date(req.created_at).toLocaleString()}</Typography>
                                <Button
                                    onClick={() => acceptRequest(req.id)}
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 1 }}
                                >
                                    Accept Request
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )
            )}
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
                <Alert severity={snack.severity}>{snack.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default AcceptRequests;
