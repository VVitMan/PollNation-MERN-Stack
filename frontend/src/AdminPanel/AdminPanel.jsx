import React, { useEffect, useState } from "react";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/user/admin/reports", {
                    method: "GET",
                    credentials: "include", // Include cookies for authentication
                    headers: {
                        "Content-Type": "application/json", // Set content type
                        // Add Authorization header if needed
                        // "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Parse JSON response
                setReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setError("Failed to load reports.");
            } finally {
                setLoading(false);
            }
        };

        const banUser = async (userId) => {
            try {
                const response = await fetch("/api/user/admin/ban", {
                    method: "POST",
                    credentials: "include", // Include cookies
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }), // Send the userId in the body
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log("User banned successfully:", data);
            } catch (error) {
                console.error("Error banning user:", error);
            }
        };
        

        fetchReports();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading reports...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.adminPanel}>
            <h1>Admin Panel - Reported Users</h1>
            <table className={styles.reportTable}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Number of Reports</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id}>
                            <td>{report.userDetails[0]?.username || "Unknown User"}</td>
                            <td>{report.count}</td>
                            <td>
                                <button
                                    className={styles.detailsButton}
                                    onClick={() => console.log(report)}
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
