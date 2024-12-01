import { useState, useEffect } from "react";
import UserReports from "./UserReports"; // Child component for viewing reports
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [selectedUserId, setSelectedUserId] = useState(null); // For viewing reports
  const [showReports, setShowReports] = useState(false); // Toggle reports view
  const [sortOrder, setSortOrder] = useState("asc"); // Track sorting order

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.filter((user) => !user.isAdmin)); // Exclude admin users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  // Handle Sorting by Report Count
  const handleSortByReportCount = () => {
    const sortedUsers = [...users].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.reportCount - b.reportCount;
      } else {
        return b.reportCount - a.reportCount;
      }
    });

    setUsers(sortedUsers); // Update the sorted users
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user._id !== userId)); // Remove user from list
      alert("User account deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  // Handle Ban User
  const handleBanUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to ban user");
      }

      // const updatedUser = await response.json(); // Get the updated user object
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isBanned: true } : user
        )
      ); // Update the specific user in the list
      alert("User has been banned successfully.");
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Failed to ban user.");
    }
  };

  // Handle Unban User
  const handleUnbanUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to unban user");
      }

      // const updatedUser = await response.json(); // Get the updated user object
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isBanned: false } : user
        )
      ); // Update the specific user in the list
      alert("User has been unbanned successfully.");
    } catch (error) {
      console.error("Error unbanning user:", error);
      alert("Failed to unban user.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {!showReports ? (
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Username</th>
              <th>Email</th>
              <th
                className="sortable-column"
                onClick={handleSortByReportCount}
              >
                Report Count {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={user.isBanned ? "banned-user" : ""}>
                <td>
                  <img
                    src={
                      user.profilePicture ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                    alt="Profile"
                    className="profile-image"
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.reportCount}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setShowReports(true);
                    }}
                  >
                    View Reports
                  </button>
                  {!user.isBanned ? (
                    <button onClick={() => handleBanUser(user._id)}>Ban</button>
                  ) : (
                    <button
                      className="unlock-ban-button"
                      onClick={() => handleUnbanUser(user._id)}
                    >
                      Unlock Ban
                    </button>
                  )}
                  <button onClick={() => handleDeleteUser(user._id)}>
                    Delete
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
