import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Collapse,
    Snackbar,
    Alert
} from "@mui/material";

function BuilderDashboard() {
    const [requests, setRequests] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    const fetchAcceptedRequests = async () => {
        try {
            const user = getAuth().currentUser;
            const token = await user.getIdToken();
            const idTokenResult = await user.getIdTokenResult();
            const firebaseUID = idTokenResult.claims.user_id || user.uid;

            const response = await axios.get("http://localhost:8000/api/requests", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const accepted = response.data.filter(
                (r) => r.is_accepted && r.builder_uid === firebaseUID
            );

            setRequests(accepted);
        } catch (error) {
            console.error(error);
            setSnack({ open: true, message: "Failed to fetch requests", severity: "error" });
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = await getAuth().currentUser.getIdToken();
            await axios.patch(`http://localhost:8000/api/requests/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRequests(prev =>
                prev.map(req =>
                    req.id === id ? { ...req, status: newStatus } : req
                )
            );

            setSnack({ open: true, message: `Marked as ${newStatus}`, severity: "success" });
        } catch (error) {
            console.error(error);
            setSnack({ open: true, message: "Failed to update status", severity: "error" });
        }
    };

    const dropRequest = async (id) => {
        try {
            const token = await getAuth().currentUser.getIdToken();
            await axios.patch(`http://localhost:8000/api/requests/${id}/drop`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRequests(prev => prev.filter(r => r.id !== id));
            setSnack({ open: true, message: "Request dropped", severity: "info" });
        } catch (error) {
            console.error(error);
            setSnack({ open: true, message: "Failed to drop request", severity: "error" });
        }
    };

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        fetchAcceptedRequests();
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                My Accepted Requests
            </Typography>

            {requests.length === 0 ? (
                <Typography>No accepted requests yet.</Typography>
            ) : (
                requests.map((req) => (
                    <Card key={req.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{req.company_name}</Typography>
                            <Typography>Status: {req.status || "Accepted"}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Submitted: {new Date(req.created_at).toLocaleString()}
                            </Typography>

                            <Button size="small" onClick={() => toggleExpand(req.id)} sx={{ mt: 1 }}>
                                {expanded[req.id] ? "Hide Details" : "Show Details"}
                            </Button>
                            <Collapse in={expanded[req.id]}>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {req.details}
                                </Typography>
                            </Collapse>

                            <Box sx={{ mt: 2 }}>
                                <Button
                                    onClick={() => updateStatus(req.id, "working")}
                                    color="warning"
                                    variant="contained"
                                    sx={{ mr: 1 }}
                                >
                                    Mark Working
                                </Button>
                                <Button
                                    onClick={() => updateStatus(req.id, "complete")}
                                    color="success"
                                    variant="contained"
                                    sx={{ mr: 1 }}
                                >
                                    Mark Complete
                                </Button>
                                <Button
                                    onClick={() => dropRequest(req.id)}
                                    color="error"
                                    variant="outlined"
                                >
                                    Drop
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}

            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack({ ...snack, open: false })}
            >
                <Alert severity={snack.severity}>{snack.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default BuilderDashboard;
