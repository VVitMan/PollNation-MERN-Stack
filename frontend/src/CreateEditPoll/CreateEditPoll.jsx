import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CreateEditPoll.module.css';
import { FaTrashAlt } from 'react-icons/fa';

function CreateEditPoll() {
    const { id } = useParams(); // Get poll/quiz ID from the URL for editing
    const navigate = useNavigate();

    // States for question, type (Poll/Quiz), and options
    const [question, setQuestion] = useState('');
    const [pollType, setPollType] = useState('Poll'); // Default to Poll
    const [choices, setChoices] = useState([
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false },
    ]);

    // Fetch poll/quiz data if editing
    useEffect(() => {
        if (id) {
            // Fetch poll/quiz details for editing
            const fetchPollQuiz = async () => {
                try {
                    const response = await fetch(`/api/poll-and-quiz/${id}`, {
                        method: 'GET',
                        credentials: 'include', // Include cookies for authentication
                    });
                    if (!response.ok) {
                        throw new Error(`Error fetching data: ${response.status}`);
                    }
                    const data = await response.json();
                    setQuestion(data.question);
                    setPollType(data.type); // Set type to Poll or Quiz
                    setChoices(data.options.map(option => ({
                        text: option.text,
                        correct: option.correct || false, // For quizzes
                    })));
                } catch (error) {
                    console.error('Error fetching poll/quiz:', error);
                }
            };

            fetchPollQuiz();
        }
    }, [id]);

    // Handle input changes
    const handleChoiceChange = (index, event) => {
        const newChoices = [...choices];
        newChoices[index].text = event.target.value;
        setChoices(newChoices);
    };

    const handleCorrectAnswerChange = (index) => {
        if (pollType === 'Quiz') {
            const newChoices = choices.map((choice, i) => ({
                ...choice,
                correct: i === index ? !choice.correct : choice.correct,
            }));
            setChoices(newChoices);
        }
    };

    const handlePollTypeChange = () => {
        setPollType(pollType === 'Poll' ? 'Quiz' : 'Poll');
    };

    // Save (create or update) poll/quiz
    const handleSave = async () => {
        try {
            const payload = { question, type: pollType, options: choices };
            const endpoint = id ? `/api/poll-and-quiz/${id}` : '/api/poll-and-quiz/create';
            const method = id ? 'PUT' : 'POST'; // PUT for editing, POST for creating

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error saving data: ${response.status}`);
            }

            const savedData = await response.json();
            console.log('Saved successfully:', savedData);

            // Redirect back to profile page after saving
            navigate(`/profile/${savedData.userId}`);
        } catch (error) {
            console.error('Error saving poll/quiz:', error);
        }
    };

    const handleCancel = () => {
        setQuestion('');
        setChoices([
            { text: '', correct: false },
            { text: '', correct: false },
            { text: '', correct: false },
            { text: '', correct: false },
        ]);
        navigate('/profile/:username'); // Redirect to the profile page
    };

    const handleDelete = async () => {
        if (!id) return; // Can't delete if not editing
        const confirmed = window.confirm('Are you sure you want to delete this poll/quiz?');
        if (confirmed) {
            try {
                const response = await fetch(`/api/poll-and-quiz/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`Error deleting data: ${response.status}`);
                }
                alert('Poll/Quiz deleted successfully.');
                navigate('/profile/:username'); // Redirect to the profile page
            } catch (error) {
                console.error('Error deleting poll/quiz:', error);
            }
        }
    };

    return (
        <div className={styles.pollContainer}>
            <h2>{id ? 'Edit' : 'Create'} Poll/Quiz</h2>
            <input
                type="text"
                placeholder="Question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={styles.questionInput}
            />
            <div className={styles.typeToggle}>
                <span>Type</span>
                <button onClick={handlePollTypeChange} className={styles.toggleButton}>
                    {pollType === 'Poll' ? 'Poll' : 'Quiz'}
                </button>
            </div>

            {choices.map((choice, index) => (
                <div key={index} className={styles.choiceContainer}>
                    {pollType === 'Quiz' && (
                        <input
                            type="checkbox"
                            checked={choice.correct}
                            onChange={() => handleCorrectAnswerChange(index)}
                            className={styles.correctCheckbox}
                        />
                    )}
                    <input
                        type="text"
                        placeholder={`Choice ${index + 1}...`}
                        value={choice.text}
                        onChange={(e) => handleChoiceChange(index, e)}
                        className={styles.choiceInput}
                    />
                </div>
            ))}

            <div className={styles.buttonGroup}>
                <button onClick={handleCancel} className={styles.cancelButton}>
                    Cancel
                </button>
                {id && (
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        🗑 Delete
                    </button>
                )}
                <button onClick={handleSave} className={styles.saveButton}>
                    Save
                </button>
            </div>
        </div>
    );
}

export default CreateEditPoll;