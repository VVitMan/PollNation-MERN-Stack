import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { FaPencilAlt } from 'react-icons/fa'; // Import pencil icon from Font Awesome

function ProfilePage() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("All");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const userData = {
        profilePic: "/Mary.jfif",
        username: username,
        bio: "This is a short user bio or description.",
    };

    const polls = [
        {
            id: 1,
            username: userData.username,
            profilePic: userData.profilePic,
            description: "This is the description for poll 1.",
            votes: 880,
            questionType: "Poll",
            options: [
                { id: 1, text: "Option 1" },
                { id: 2, text: "Option 2" },
                { id: 3, text: "Option 3" },
                { id: 4, text: "Option 4" }
            ],
        },
        {
            id: 2,
            username: userData.username,
            profilePic: userData.profilePic,
            description: "This is the description for poll 2.",
            votes: 680,
            questionType: "Poll",
            options: [
                { id: 1, text: "Option 1"},
                { id: 2, text: "Option 2"},
                { id: 3, text: "Option 3"}
            ],
        },
        // Additional polls can go here
    ];

    return (
        <div className={styles.profilePage}>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
                <img className={styles.profileImage} src={userData.profilePic} alt="Profile" />
                <h1 className={styles.username}>{userData.username}
                    <Link to="/edit-profile">
                        &nbsp;<FaPencilAlt className={styles.editProfileIcon} /> {/* Pencil icon with link */}
                    </Link></h1>
                <p className={styles.bio}>{userData.bio}</p>
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
                    <div key={poll.id} className={styles.pollCard}>
                        <div className={styles.pollHeader}>
                            <img className={styles.pollProfileImage} src={poll.profilePic} alt="Profile" />
                            <h2 className={styles.pollUsername}>{poll.username}</h2>
                            {/* <span className={styles.editIcon}>✎</span> */}
                            <Link to={`/edit-poll/${poll.id}`}>
                                <FaPencilAlt className={styles.editIcon} />
                            </Link>
                        </div>
                        <p className={styles.pollDescription}>{poll.description}</p>
                        <p className={styles.voteCount}>{poll.votes} Votes</p>
                        <div className={styles.options}>
                            {poll.options.map((option) => (
                                <div key={option.id} className={styles.option}>
                                    {option.imageUrl && (
                                        <img src={option.imageUrl} alt="Option" className={styles.optionImage} />
                                    )}
                                    <label>{option.text}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfilePage;
