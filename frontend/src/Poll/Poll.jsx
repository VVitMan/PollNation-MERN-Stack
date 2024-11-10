import { useEffect, useState } from 'react';
import styles from './Poll.module.css';

function Poll() {
    const [pollData, setPollData] = useState([]);

    useEffect(() => {
        // Mock API call to fetch multiple poll data
        const fetchPollData = async () => {
            // Simulate API response
            const response = await new Promise((resolve) =>
                setTimeout(() => {
                    resolve([
                        {
                            username: "Mary",
                            profilePic: "/Mary.jfif",
                            description: "This is Mary's poll description.",
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
                            description: "This is Perth's poll description test. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus perspiciatis aut quisquam, ipsam quidem quis asperiores, natus cumque illo ut sunt accusamus dignissimos iste ratione. Perspiciatis eum voluptatem eius incidunt.",
                            votes: 530,
                            options: [
                                { id: 1, text: "True" },
                                { id: 2, text: "False" },
                            ]
                        }
                    ]);
                }, 1000)
            );
            setPollData(response);
        };

        fetchPollData();
    }, []);

    if (pollData.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {pollData.map((poll, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <img className={styles.cardImage} src={poll.profilePic} alt="Profile" />
                        <h2 className={styles.cardTitle}>{poll.username}</h2>
                    </div>
                    <p className={styles.cardDescription}>
                        {poll.description}
                    </p>
                    <div className={styles.voteInfo}>
                        <p className={styles.voteCount}>{poll.votes} Votes</p>
                        <div className={styles.pollOptions}>
                            {poll.options.map(option => (
                                <div key={option.id} className={styles.option}>
                                    <input type="radio" name={`poll-${index}`} value={option.id} />
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

export default Poll;
