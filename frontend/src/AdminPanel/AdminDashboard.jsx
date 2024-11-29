import { useState, useEffect } from "react";
import UserReports from "./UserReports"; // Child component for viewing reports

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [selectedUserId, setSelectedUserId] = useState(null); // User ID for fetching reports
  const [showReports, setShowReports] = useState(false); // Toggle report view

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users", {
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        // Filter out admin users
        const filteredUsers = data.filter((user) => !user.isAdmin);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle "View Reports" button click
  const handleViewReports = (userId) => {
    setSelectedUserId(userId);
    setShowReports(true);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {!showReports ? (
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    style={{ width: "50px", borderRadius: "50%" }}
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleViewReports(user._id)}>
                    View Reports
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <UserReports userId={selectedUserId} setShowReports={setShowReports} />
      )}
    </div>
  );
};

export default AdminDashboard;
