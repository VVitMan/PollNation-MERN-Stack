import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const UserReports = ({ userId, setShowReports }) => {
  console.log("User Reports", userId, setShowReports);
  const [reports, setReports] = useState([]); // State to store reports
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch reports for the selected user
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}/reports`, {
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  return (
    <div>
      <button onClick={() => setShowReports(false)}>Back to Dashboard</button>
      <h2>User Reports</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reports.length > 0 ? (
        <ul>
          {reports.map((report) => (
            <li key={report._id}>
              <p>
                <strong>Reported by:</strong>{" "}
                {report.reporterUserId?.username || "Unknown"}
              </p>
              <p>
                <strong>Reason:</strong> {report.reason}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reports found for this user.</p>
      )}
    </div>
  );
};

// Define prop types for validation
UserReports.propTypes = {
  userId: PropTypes.string.isRequired, // User ID must be a string and is required
  setShowReports: PropTypes.func.isRequired, // setShowReports must be a function and is required
};

export default UserReports;
