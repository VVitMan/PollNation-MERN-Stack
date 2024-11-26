import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Poll.module.css";

function PollAll() {
    const [pollQuizData, setPollQuizData] = useState([]); // Data for both polls and quizzes
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isCommentsOpen, setIsCommentsOpen] = useState(false); // Controls comment overlay visibility
    const [currentComments, setCurrentComments] = useState([]); // Holds the comments for the selected poll
    const [newComment, setNewComment] = useState(""); // Holds the value of the new comment input
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/poll-and-quiz/all", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const formattedData = data.map((item) => ({
                    username: item.userId?.username || "Unknown User",
                    profilePic:
                        item.userId?.profilePicture ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
                    description: item.question,
                    questionType: item.type,
                    votes: item.type === "Poll"
                        ? item.options.reduce((total, option) => total + option.votes, 0)
                        : null,
                    options: item.options.map((option) => ({
                        id: option._id,
                        text: option.text,
                        correct: option.correct || false,
                    })),
                    correctAnswer: item.type === "Quiz" ? item.correctAnswer : null,
                    comments: item.comments || [], // Include comments for each poll/quiz
                }));

                setPollQuizData(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
    };

    const handleOptionSelect = (index, optionId) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [index]: prev[index] === optionId ? null : optionId,
        }));
    };

    const handleViewComments = (comments) => {
        setCurrentComments(comments); // Load the comments for the selected poll
        setIsCommentsOpen(true); // Show the overlay
    };

    const handleAddComment = () => {
        if (newComment.trim() === "") return;
        setCurrentComments((prev) => [...prev, { username: "You", text: newComment }]); // Add new comment
        setNewComment(""); // Clear input
    };

    const handleCloseComments = () => {
        setIsCommentsOpen(false); // Close the overlay
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        try {
            const response = await fetch(`/api/poll/${currentPollId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: currentUser.username,
                    text: commentInput,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedPoll = await response.json();
            setPollQuizData((prev) =>
                prev.map((poll) =>
                    poll._id === updatedPoll._id ? updatedPoll : poll
                )
            );
            setCommentInput(""); // Clear the input field
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <>
            {pollQuizData.map((item, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <img
                            className={styles.cardImage}
                            src={item.profilePic}
                            alt="Profile"
                            onClick={() => handleProfileClick(item.username)}
                        />
                        <h2
                            className={styles.cardTitle}
                            onClick={() => handleProfileClick(item.username)}
                        >
                            {item.username}
                        </h2>
                    </div>
                    <p className={styles.cardDescription}>{item.description}</p>
                    <div className={styles.voteInfo}>
                        {item.questionType === "Poll" ? (
                            <>
                                <p className={styles.voteCount}>{item.votes} Votes</p>
                                <div className={styles.pollOptions}>
                                    {item.options.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`${styles.option} ${
                                                selectedOptions[index] === option.id
                                                    ? styles.selected
                                                    : ""
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
                            </>
                        ) : (
                            <>
                                <div className={styles.pollOptions}>
                                    {item.options.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`${styles.option} ${
                                                selectedOptions[index] === option.id
                                                    ? styles.selected
                                                    : ""
                                            }`}
                                            onClick={() => handleOptionSelect(index, option.id)}
                                        >
                                            <input
                                                type="radio"
                                                name={`quiz-${index}`}
                                                value={option.id}
                                                checked={selectedOptions[index] === option.id}
                                                onChange={() => handleOptionSelect(index, option.id)}
                                            />
                                            <label>{option.text}</label>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className={styles.submitQuizButton}
                                    onClick={() => alert("Submit functionality not implemented!")}
                                >
                                    Submit
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className={styles.viewCommentsButton}
                        onClick={() => handleViewComments(item.comments)}
                    >
                        View Comments
                    </button>
                </div>
            ))}

            {isCommentsOpen && currentPollId && (
                <div className={styles.commentsOverlay}>
                    <div className={styles.commentsContainer}>
                        <button
                            className={styles.closeButton}
                            onClick={handleCloseComments}
                        >
                            Close
                        </button>
                        <h3>Comments</h3>
                        {/* Safely find the current poll and map over its comments */}
                        {pollQuizData
                            .find((poll) => poll._id === currentPollId)
                            ?.comments?.map((comment, index) => (
                                <div key={index} className={styles.commentItem}>
                                    <strong>{comment.username}: </strong>
                                    <span>{comment.text}</span>
                                </div>
                            )) || (
                                <p className={styles.noComments}>
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        <form
                            className={styles.commentForm}
                            onSubmit={handleCommentSubmit}
                        >
                            <input
                                type="text"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder="Add a comment..."
                                className={styles.commentInput}
                                required
                            />
                            <button
                                type="submit"
                                className={styles.commentSubmitButton}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
}

export default PollAll;



// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './Poll.module.css';
// // import { useSelector } from 'react-redux';

// function PollAll() {
//     const [pollData, setPollData] = useState([]);
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const navigate = useNavigate();
//     // const { currentUser } = useSelector((state) => state.user); 

//     useEffect(() => {
//         const fetchPollData = async () => {
//             try {
//                 console.log('Fetching poll data...');
//                 const response = await fetch('/api/poll/all', {
//                     method: 'GET',
//                     credentials: 'include' // Ensures cookies are included
//                 });

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 console.log('Poll All data:', data);

//                 // Format data to match frontend structure
//                 const formattedPolls = data.map(poll => ({
//                     username: poll.userId?.username || "Unknown User", // Fallback for missing username
//                     profilePic: poll.userId?.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1731505734~exp=1731509334~hmac=9bea33c021abe0f8cd8cef8a3b9ff9af22f3ca8c201701e289c588f4c559d20e&w=1060',
//                     description: poll.question, // Poll question
//                     questionType: 'Poll',
//                     votes: poll.options.reduce((total, option) => total + option.votes, 0),
//                     options: poll.options.map(option => ({
//                         id: option._id,
//                         text: option.text
//                     }))
//                 }));

//                 setPollData(formattedPolls);
//                 console.log("Format: ",formattedPolls);
//             } catch (error) {
//                 console.error('Error fetching polls:', error);
//             }
//         };

//         fetchPollData();
//     }, []);

//     const handleProfileClick = (username) => {
//         console.log(`Navigating to profile of: ${username}`);
//         navigate(`/profile/${username}`);
//     };

//     const handleOptionSelect = (pollIndex, optionId) => {
//         console.log(`Selected option ${optionId} for poll index ${pollIndex}`);
//         setSelectedOptions((prev) => ({
//             ...prev,
//             [pollIndex]: prev[pollIndex] === optionId ? null : optionId
//         }));
//     };

//     return (
//         <>
//             {pollData.map((poll, index) => (
//                 <div key={index} className={styles.card}>
//                     <div className={styles.cardHeader}>
//                         <img
//                             className={styles.cardImage}
//                             src={poll.profilePic}
//                             alt="Profile"
//                             onClick={() => handleProfileClick(poll.username)}
//                         />
//                         {/* Name of user on poll */}
//                         <h2
//                             className={styles.cardTitle}
//                             onClick={() => handleProfileClick(poll.username)}
//                         >
//                             {poll.username}
//                         </h2>
//                     </div>
//                     <p className={styles.cardDescription}>
//                         {poll.description}
//                     </p>
//                     <div className={styles.voteInfo}>
//                         {/* Vote Count */}
//                         <p className={styles.voteCount}>{poll.votes} Votes</p>
//                         {/* Option */}
//                         <div className={styles.pollOptions}>
//                             {poll.options.map(option => (
//                                 <div
//                                     key={option.id}
//                                     className={`${styles.option} ${
//                                         selectedOptions[index] === option.id
//                                             ? styles.selected
//                                             : ''
//                                     }`}
//                                     onClick={() => handleOptionSelect(index, option.id)}
//                                 >
//                                     <input
//                                         type="radio"
//                                         name={`poll-${index}`}
//                                         value={option.id}
//                                         checked={selectedOptions[index] === option.id}
//                                         onChange={() => handleOptionSelect(index, option.id)}
//                                     />
//                                     <label>{option.text}</label>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </>
//     );
// }

// export default PollAll;
