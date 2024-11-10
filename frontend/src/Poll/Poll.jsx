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
                        },
                        {
                            username: "Alice",
                            profilePic: "/Unknown.png",
                            description: "Alice's favorite color poll. What's your favorite color?",
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
