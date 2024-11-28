import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./ProfilePage.module.css";
import { FaPencilAlt, FaPlus } from "react-icons/fa";

function ProfilePage() {
    const { username } = useParams(); // Get username from URL
    const { currentUser } = useSelector((state) => state.user); // Logged-in user
    const [userData, setUserData] = useState(null);
    const [data, setData] = useState([]); // Combined polls and quizzes
    const [activeTab, setActiveTab] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReportForm, setShowReportForm] = useState(false); // Toggle report form visibility
    const [reportReason, setReportReason] = useState(""); // For report functionality
    const [reportStatus, setReportStatus] = useState(""); // To show feedback on reporting

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/poll-and-quiz/${username}`, {
                    method: "GET",
                    credentials: "include", // Include cookies for authentication
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setUserData(result.user);
                setData(result.data); // Set polls and quizzes
            } catch (error) {
                setError("Failed to load profile data.");
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    /* Loading State */
    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    /* Error State */
    if (error) {
        return <div className={styles.error}>Something went wrong</div>;
    }

    /* Filter Data */
    const filteredData = activeTab === "All" ? data : data.filter((item) => item.type === activeTab);

    /* Handle Report Submission */
    const handleReport = async () => {
        if (!reportReason) {
            setReportStatus("Please provide a reason for reporting.");
            return;
        }
    
        try {
            // Fetch User ID by username
            const response = await fetch(`/api/user/id/${username}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user ID: ${response.status}`);
            }
            const data = await response.json();
            const userId = data.userId;
    
            // Submit the report
            const reportResponse = await fetch("/api/user/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reportedUserId: userId,
                    reason: reportReason,
                }),
            });
    
            if (!reportResponse.ok) {
                const errorData = await reportResponse.json();
                throw new Error(errorData.message || `HTTP error! Status: ${reportResponse.status}`);
            }
    
            setReportStatus("Report submitted successfully!");
            setReportReason(""); // Reset input
            setShowReportForm(false); // Hide the form
        } catch (error) {
            console.error("Error submitting report:", error.message);
            setReportStatus(error.message || "Failed to submit report.");
        }
    };
    
    return (
        <div className={styles.profilePage}>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
                <img
                    className={styles.profileImage}
                    src={
                        userData?.profilePicture ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                    alt="Profile"
                />
                <h1 className={styles.username}>
                    {userData?.username}
                    {currentUser?.username === username && (
                        <Link to="/edit-profile">
                            &nbsp;<FaPencilAlt className={styles.editProfileIcon} />
                        </Link>
                    )}
                </h1>
                <p className={styles.bio}>{userData?.description || "This user has no bio yet."}</p>

                {/* Report User Section */}
                {currentUser?.username !== username && (
                    <div className={styles.reportSection}>
                        {!showReportForm ? (
                            <button
                                onClick={() => setShowReportForm(true)}
                                className={styles.reportButton}
                            >
                                Report User
                            </button>
                        ) : (
                            <>
                                <textarea
                                    placeholder="Reason for reporting"
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className={styles.reportTextarea}
                                />
                                <div className={styles.buttonContainer}>
                                <button
                                    onClick={() => setShowReportForm(false)}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button onClick={handleReport} className={styles.reportButton}>
                                    Submit Report
                                </button>
                                </div>
                                {reportStatus && (
                                    <p className={`${styles.reportStatus} ${reportStatus.includes("Failed") ? styles.error : ""}`}>
                                        {reportStatus}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Filter Tabs */}
            <div className={styles.tabs}>
                <span
                    className={`${styles.tab} ${activeTab === "All" ? styles.activeTab : ""}`}
                    onClick={() => handleTabClick("All")}
                >
                    All
                </span>
                <span
                    className={`${styles.tab} ${activeTab === "Poll" ? styles.activeTab : ""}`}
                    onClick={() => handleTabClick("Poll")}
                >
                    Poll
                </span>
                <span
                    className={`${styles.tab} ${activeTab === "Quiz" ? styles.activeTab : ""}`}
                    onClick={() => handleTabClick("Quiz")}
                >
                    Quiz
                </span>
            </div>

            {/* Polls and Quizzes List */}
            <div className={styles.pollsList}>
                {filteredData.map((item) => (
                    <div key={item._id} className={styles.pollCard}>
                        <div className={styles.pollHeader}>
                            <img
                                className={styles.pollProfileImage}
                                src={userData?.profilePicture || "/default-profile.png"}
                                alt="Profile"
                            />
                            <h2 className={styles.pollUsername}>{userData?.username}</h2>
                            {currentUser?.username === username && (
                                <Link to={`/update/poll-and-quiz/${item._id}`}>
                                    <FaPencilAlt className={styles.editIcon} />
                                </Link>
                            )}
                        </div>
                        <p className={styles.pollDescription}>{item.question}</p>
                        {item.type === "Poll" ? (
                            <p className={styles.voteCount}>
                                {item.options.reduce((total, option) => total + option.votes, 0)} Votes
                            </p>
                        ) : (
                            <p className={styles.voteCount}>Quiz</p>
                        )}
                        <div className={styles.options}>
                            {item.options.map((option) => (
                                <div key={option._id} className={styles.option}>
                                    <label>{option.text}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating '+' Button */}
            {currentUser?.username === username && (
                <Link to="/create/poll-and-quiz" className={styles.floatingButton}>
                    <FaPlus />
                </Link>
            )}
        </div>
    );
}

export default ProfilePage;
