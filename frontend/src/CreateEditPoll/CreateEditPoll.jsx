import { useState } from 'react';
import styles from './CreateEditPoll.module.css';
import { FaTrashAlt } from 'react-icons/fa';

function CreateEditPoll() {
    const [question, setQuestion] = useState('');
    const [pollType, setPollType] = useState('Poll');
    const [choices, setChoices] = useState([{ text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }]);

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

    const handleSave = () => {
        console.log('Poll saved:', { question, pollType, choices });
        // Logic to save or create poll
    };

    const handleCancel = () => {
        // Logic to cancel or reset form
        setQuestion('');
        setChoices([{ text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }]);
    };

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this poll?");
        if (confirmed) {
            // Perform delete operation here (e.g., API request)
            alert("Poll deleted successfully.");
            navigate("/profile/:username"); // Redirect to the profile page or another appropriate page
        }
    };
    
    return (
        <div className={styles.pollContainer}>
            <h2>Create/Edit</h2>
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
                <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                <button className={styles.deleteButton} onClick={handleDelete}>🗑 Delete</button>
                <button onClick={handleSave} className={styles.saveButton}>Save</button>
            </div>
        </div>
    );
}

export default CreateEditPoll;