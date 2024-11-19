import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './ProfilePage.module.css';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';

function ProfilePage() {
    const { username } = useParams(); // Get username from the URL
    const { currentUser } = useSelector((state) => state.user); // Get logged-in user
    const [userData, setUserData] = useState(null);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("All");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/poll/profile/${username}`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authorization
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data.user);
                setPolls(data.polls);
            } catch (error) {
                setError('Failed to load profile data.');
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.profilePage}>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
                <img
                    className={styles.profileImage}
                    src={userData?.profilePicture || '/default-profile.png'}
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
                <p className={styles.bio}>{userData?.bio || "This user has no bio yet."}</p>
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

            {/* Polls List */}
            <div className={styles.pollsList}>
                {polls.map((poll) => (
                    <div key={poll._id} className={styles.pollCard}>
                        <div className={styles.pollHeader}>
                            <img
                                className={styles.pollProfileImage}
                                src={userData?.profilePicture || '/default-profile.png'}
                                alt="Profile"
                            />
                            <h2 className={styles.pollUsername}>{userData?.username}</h2>
                            {currentUser?.username === username && (
                                <Link to={`/edit-poll/${poll._id}`}>
                                    <FaPencilAlt className={styles.editIcon} />
                                </Link>
                            )}
                        </div>
                        <p className={styles.pollDescription}>{poll.question}</p>
                        <p className={styles.voteCount}>
                            {poll.options.reduce((total, option) => total + option.votes, 0)} Votes
                        </p>
                        <div className={styles.options}>
                            {poll.options.map((option) => (
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
                <Link to="/edit-poll/new" className={styles.floatingButton}>
                    <FaPlus />
                </Link>
            )}
        </div>
    );
}

export default ProfilePage;