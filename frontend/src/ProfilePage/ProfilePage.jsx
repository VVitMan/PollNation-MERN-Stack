import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './ProfilePage.module.css';
import { FaPencilAlt, FaPlus } from 'react-icons/fa';

function ProfilePage() {
    const { username } = useParams(); // Get username from URL
    const { currentUser } = useSelector((state) => state.user); // Logged-in user
    const [userData, setUserData] = useState(null);
    const [data, setData] = useState([]); // Combined polls and quizzes
    const [activeTab, setActiveTab] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/poll-and-quiz/${username}`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setUserData(result.user);
                setData(result.data); // Set polls and quizzes
            } catch (error) {
                setError('Failed to load profile data.');
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    /* Effect loading Text */
    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    /* Error message */
    if (error) {
        return <div className={styles.error}>Some Went Wrong</div>;
    }

    const filteredData = activeTab === "All"
        ? data
        : data.filter(item => item.type === activeTab);

    console.log("Filtered",filteredData)
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
                <p className={styles.bio}>{userData?.description || "This user has no bio yet."}</p>
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
                                src={userData?.profilePicture || '/default-profile.png'}
                                alt="Profile"
                            />
                            <h2 className={styles.pollUsername}>{userData?.username}</h2>
                            {currentUser?.username === username && (
                                <Link to={`/edit/poll-and-quiz/${item._id}`}>
                                    <FaPencilAlt className={styles.editIcon} />
                                </Link>
                            )}
                        </div>
                        <p className={styles.pollDescription}>{item.question}</p>
                        {item.type === 'Poll' ? (
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
                <Link to="/edit-poll-or-quiz/new" className={styles.floatingButton}>
                    <FaPlus />
                </Link>
            )}
        </div>
    );
}

export default ProfilePage;