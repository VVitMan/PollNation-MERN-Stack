import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Poll.module.css';
// import { useSelector } from 'react-redux';

function PollAll() {
    const [pollData, setPollData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();
    // const { currentUser } = useSelector((state) => state.user); 

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                console.log('Fetching poll data...');
                const response = await fetch('/api/poll/all', {
                    method: 'GET',
                    credentials: 'include' // Ensures cookies are included
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Poll data fetched:', data);

                // Format data to match frontend structure
                const formattedPolls = data.map(poll => ({
                    username: poll.userId?.username || "Unknown User", // Fallback for missing username
                    profilePic: poll.userId?.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1731505734~exp=1731509334~hmac=9bea33c021abe0f8cd8cef8a3b9ff9af22f3ca8c201701e289c588f4c559d20e&w=1060',
                    description: poll.question, // Poll question
                    questionType: 'Poll',
                    votes: poll.options.reduce((total, option) => total + option.votes, 0),
                    options: poll.options.map(option => ({
                        id: option._id,
                        text: option.text
                    }))
                }));

                setPollData(formattedPolls);
                console.log("Format: ",formattedPolls);
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };

        fetchPollData();
    }, []);

    const handleProfileClick = (username) => {
        console.log(`Navigating to profile of: ${username}`);
        navigate(`/profile/${username}`);
    };

    const handleOptionSelect = (pollIndex, optionId) => {
        console.log(`Selected option ${optionId} for poll index ${pollIndex}`);
        setSelectedOptions((prev) => ({
            ...prev,
            [pollIndex]: prev[pollIndex] === optionId ? null : optionId
        }));
    };

    return (
        <>
            {pollData.map((poll, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <img
                            className={styles.cardImage}
                            src={poll.profilePic}
                            alt="Profile"
                            onClick={() => handleProfileClick(poll.username)}
                        />
                        {/* Name of user on poll */}
                        <h2
                            className={styles.cardTitle}
                            onClick={() => handleProfileClick(poll.username)}
                        >
                            {poll.username}
                        </h2>
                    </div>
                    <p className={styles.cardDescription}>
                        {poll.description}
                    </p>
                    <div className={styles.voteInfo}>
                        {/* Vote Count */}
                        <p className={styles.voteCount}>{poll.votes} Votes</p>
                        {/* Option */}
                        <div className={styles.pollOptions}>
                            {poll.options.map(option => (
                                <div
                                    key={option.id}
                                    className={`${styles.option} ${
                                        selectedOptions[index] === option.id
                                            ? styles.selected
                                            : ''
                                    }`}
                                    onClick={() => handleOptionSelect(index, option.id)}
                                >
                                    <input
                                        type="radio"
                                        name={`poll-${index}`}
                                        value={option.id}
                                        checked={selectedOptions[index] === option.id}
                                        onChange={() => handleOptionSelect(index, option.id)}
                                    />
                                    <label>{option.text}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default PollAll;