import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Poll.module.css';

function PollAll() {
    const [pollQuizData, setPollQuizData] = useState([]); // Data for both polls and quizzes
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching poll and quiz data...');
                const response = await fetch('/api/poll-and-quiz/all', { // Unified route for polls and quizzes
                    method: 'GET',
                    credentials: 'include', // Include cookies for authentication
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Poll and Quiz Data:', data);

                // Format data to match frontend structure
                const formattedData = data.map(item => ({
                    username: item.userId?.username || "Unknown User", // Fallback for missing username
                    profilePic: item.userId?.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
                    description: item.question, // Question
                    questionType: item.type, // 'Poll' or 'Quiz'
                    votes: item.type === 'Poll'
                        ? item.options.reduce((total, option) => total + option.votes, 0) // Total votes for polls
                        : null, // No votes needed for quizzes
                    options: item.options.map(option => ({
                        id: option._id,
                        text: option.text,
                        correct: option.correct || false, // Include `correct` for quizzes
                    })),
                    correctAnswer: item.type === 'Quiz' ? item.correctAnswer : null, // Add correct answer for quizzes
                }));

                setPollQuizData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleProfileClick = (username) => {
        console.log(`Navigating to profile of: ${username}`);
        navigate(`/profile/${username}`);
    };

    const handleOptionSelect = (index, optionId) => {
        console.log(`Selected option ${optionId} for index ${index}`);
        setSelectedOptions(prev => ({
            ...prev,
            [index]: prev[index] === optionId ? null : optionId, // Toggle selection
        }));
    };

    const handleQuizSubmit = (index) => {
        const selectedOptionId = selectedOptions[index];
        const selectedOption = pollQuizData[index].options.find(option => option.id === selectedOptionId);
        const isCorrect = selectedOption?.correct || false;

        alert(isCorrect ? "Correct Answer!" : "Wrong Answer. Try again!");
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
                        {/* Display username */}
                        <h2
                            className={styles.cardTitle}
                            onClick={() => handleProfileClick(item.username)}
                        >
                            {item.username}
                        </h2>
                    </div>
                    <p className={styles.cardDescription}>{item.description}</p>
                    <div className={styles.voteInfo}>
                        {item.questionType === 'Poll' ? (
                            <>
                                {/* Display votes for polls */}
                                <p className={styles.voteCount}>{item.votes} Votes</p>
                                <div className={styles.pollOptions}>
                                    {item.options.map(option => (
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
                            </>
                        ) : (
                            <>
                                {/* Display quiz options */}
                                <div className={styles.pollOptions}>
                                    {item.options.map(option => (
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
                                    onClick={() => handleQuizSubmit(index)}
                                >
                                    Submit
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
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