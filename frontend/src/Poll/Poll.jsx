import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Poll.module.css';

function Poll() {
    const [pollData, setPollData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showResults, setShowResults] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPollData = async () => {
            const response = await new Promise((resolve) =>
                setTimeout(() => {
                    resolve([
                        {
                            username: "Mary",
                            profilePic: "/Mary.jfif",
                            description: "This is Mary's poll description.",
                            questionType: "Poll",
                            votes: 880,
                            options: [
                                { id: 1, text: "Option 1" },
                                { id: 2, text: "Option 2" },
                                { id: 3, text: "Option 3" },
                                { id: 4, text: "Option 4" }
                            ]
                        },
                        {
                            username: "Perth",
                            profilePic: "/Portrait-Tarnakij.png",
                            description: "In Python, a function must always include a return statement to avoid an error. True of False?",
                            questionType: "Quiz",
                            votes: 530,
                            correctAnswer: 2, // The correct answer ID
                            explanation: "In Python, a function does not require a return statement. If there is no return statement, the function automatically returns None.",
                            options: [
                                { id: 1, text: "True" },
                                { id: 2, text: "False" },
                            ]
                        },
                        {
                            username: "Alice",
                            profilePic: "/Unknown.png",
                            description: "Alice's favorite color poll. What's your favorite color?",
                            questionType: "Poll",
                            votes: 1200,
                            options: [
                                { id: 1, text: "Red" },
                                { id: 2, text: "Blue" },
                                { id: 3, text: "Green" },
                                { id: 4, text: "Yellow" }
                            ]
                        },
                        {
                            username: "John",
                            profilePic: "/Unknown.png",
                            description: "John is curious about the best programming language for beginners.",
                            questionType: "Poll",
                            votes: 750,
                            options: [
                                { id: 1, text: "Python" },
                                { id: 2, text: "JavaScript" },
                                { id: 3, text: "Java" },
                                { id: 4, text: "C++" }
                            ]
                        },
                        {
                            username: "Sophia",
                            profilePic: "/Unknown.png",
                            description: "Sophia wants to know your preferred travel destination.",
                            questionType: "Poll",
                            votes: 410,
                            options: [
                                { id: 1, text: "Beach" },
                                { id: 2, text: "Mountains" },
                                { id: 3, text: "City" },
                                { id: 4, text: "Countryside" }
                            ]
                        },
                        {
                            username: "Leo",
                            profilePic: "Unknown.png",
                            description: "Leo asks: 'Do you prefer cats or dogs?'",
                            questionType: "Poll",
                            votes: 950,
                            options: [
                                { id: 1, text: "Cats" },
                                { id: 2, text: "Dogs" },
                                { id: 3, text: "Both" },
                                { id: 4, text: "Neither" }
                            ]
                        },
                        {
                            username: "Emma",
                            profilePic: "/Unknown.png",
                            description: "Emma is interested in your favorite season.",
                            questionType: "Poll",
                            votes: 610,
                            options: [
                                { id: 1, text: "Spring" },
                                { id: 2, text: "Summer" },
                                { id: 3, text: "Fall" },
                                { id: 4, text: "Winter" }
                            ]
                        },
                        {
                            username: "Oliver",
                            profilePic: "/Unknown.png",
                            description: "Oliver wants to know your favorite sport to watch.",
                            questionType: "Poll",
                            votes: 340,
                            options: [
                                { id: 1, text: "Football" },
                                { id: 2, text: "Basketball" },
                                { id: 3, text: "Tennis" },
                                { id: 4, text: "Baseball" }
                            ]
                        },
                        {
                            username: "Mia",
                            profilePic: "/Unknown.png",
                            description: "Mia asks: 'Do you prefer online shopping or in-store shopping?'",
                            questionType: "Poll",
                            votes: 290,
                            options: [
                                { id: 1, text: "Online" },
                                { id: 2, text: "In-store" }
                            ]
                        },
                        {
                            username: "Lucas",
                            profilePic: "/Unknown.png",
                            description: "Lucas wants to know your favorite genre of music.",
                            questionType: "Poll",
                            votes: 860,
                            options: [
                                { id: 1, text: "Rock" },
                                { id: 2, text: "Pop" },
                                { id: 3, text: "Hip-Hop" },
                                { id: 4, text: "Classical" }
                            ]
                        },
                        {
                            username: "Ava",
                            profilePic: "/Unknown.png",
                            description: "Ava is curious about your favorite social media platform.",
                            questionType: "Poll",
                            votes: 500,
                            options: [
                                { id: 1, text: "Facebook" },
                                { id: 2, text: "Instagram" },
                                { id: 3, text: "Twitter" },
                                { id: 4, text: "TikTok" }
                            ]
                        },
                        {
                            username: "Ethan",
                            profilePic: "/Unknown.png",
                            description: "Ethan's movie genre poll: What's your favorite movie genre?",
                            questionType: "Poll",
                            votes: 700,
                            options: [
                                { id: 1, text: "Action" },
                                { id: 2, text: "Comedy" },
                                { id: 3, text: "Drama" },
                                { id: 4, text: "Horror" }
                            ]
                        }
                        
                    ]);
                }, 1000)
            );
            setPollData(response);
        };

        fetchPollData();
    }, []);

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    };

    const handleOptionSelect = (pollIndex, optionId) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [pollIndex]: prev[pollIndex] === optionId ? null : optionId
        }));

        if (pollData[pollIndex].questionType === "Quiz") {
            setShowResults((prev) => ({
                ...prev,
                [pollIndex]: prev[pollIndex] === true && selectedOptions[pollIndex] === optionId ? false : true
            }));
        }
    };

    if (pollData.length === 0) {
        return (
            <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                /*alignItems: 'center', (Vertical)*/
                height: '100vh',
                textAlign: 'center',
                fontSize: '1.5em',
                color: '#333'
            }}>
                <p>Loading...</p>
            </div>
        );
    }
    

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
                        <p className={styles.voteCount}>{poll.votes} {poll.questionType === 'Quiz' ? 'Answered' : 'Votes'}</p>
                        <div className={styles.pollOptions}>
                            {poll.options.map(option => (
                                <div
                                    key={option.id}
                                    className={`${styles.option} ${
                                        selectedOptions[index] === option.id
                                            ? styles.selected
                                            : selectedOptions[index] !== undefined && selectedOptions[index] !== null
                                            ? styles.unselected
                                            : ''
                                    } ${
                                        poll.questionType === 'Quiz' && showResults[index]
                                            ? option.id === poll.correctAnswer
                                                ? styles.correct
                                                : selectedOptions[index] === option.id
                                                ? styles.wrong
                                                : ''
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
                        {poll.questionType === 'Quiz' && showResults[index] && poll.explanation && (
                            <div className={styles.explanation}>
                                <strong>Explanation:</strong> {poll.explanation}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

export default Poll;
