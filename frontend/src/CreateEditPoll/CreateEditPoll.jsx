import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CreateEditPoll.module.css';

function EditPollQuiz() {
    const { id } = useParams(); // Get the ID of the poll/quiz to edit
    const navigate = useNavigate();

    // State for poll/quiz type, question, and choices
    const [type, setType] = useState('');
    const [question, setQuestion] = useState('');
    const [choices, setChoices] = useState([]);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [error, setError] = useState(null); // To handle errors

    // Fetch data when editing
    useEffect(() => {
        if (!id) {
            setError('No ID provided for editing.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const endpoint = `/api/poll-and-quiz/find/${id}`;
                const response = await fetch(endpoint, { method: 'GET', credentials: 'include' });
                if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
                const data = await response.json();

                setType(data.type);
                setQuestion(data.question);
                setChoices(
                    data.options.map(option => ({
                        text: option.text,
                        correct: option.correct || false,
                    }))
                );
                setLoading(false); // Data is loaded
            } catch (error) {
                console.error('Error fetching poll/quiz:', error);
                setError('Failed to fetch poll/quiz data. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Handle changes
    const handleChoiceChange = (index, event) => {
        const newChoices = [...choices];
        newChoices[index].text = event.target.value;
        setChoices(newChoices);
    };

    const handleCorrectAnswerChange = (index) => {
        if (type === 'Quiz') {
            const newChoices = choices.map((choice, i) => ({
                ...choice,
                correct: i === index ? !choice.correct : choice.correct,
            }));
            setChoices(newChoices);
        }
    };

    const handleSave = async () => {
        try {
            const endpoint = `/api/${type.toLowerCase()}/${id}`;
            const method = 'PUT';

            const payload = { question, options: choices };
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`Error saving data: ${response.status}`);

            const data = await response.json();
            console.log('Updated successfully:', data);

            // Redirect after saving
            navigate(`/profile`);
        } catch (error) {
            console.error('Error updating poll/quiz:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this poll/quiz?')) {
            try {
                const endpoint = `/api/${type.toLowerCase()}/${id}`;
                const response = await fetch(endpoint, { method: 'DELETE', credentials: 'include' });
                if (!response.ok) throw new Error(`Error deleting data: ${response.status}`);

                alert('Deleted successfully');
                navigate('/profile');
            } catch (error) {
                console.error('Error deleting poll/quiz:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.pollContainer}>
            <h2>Edit {type}</h2>
            <input
                type="text"
                placeholder="Question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={styles.questionInput}
            />
            {choices.map((choice, index) => (
                <div key={index} className={styles.choiceContainer}>
                    {type === 'Quiz' && (
                        <input
                            type="checkbox"
                            checked={choice.correct}
                            onChange={() => handleCorrectAnswerChange(index)}
                            className={styles.correctCheckbox}
                        />
                    )}
                    <input
                        type="text"
                        placeholder={`Choice ${index + 1}`}
                        value={choice.text}
                        onChange={(e) => handleChoiceChange(index, e)}
                        className={styles.choiceInput}
                    />
                </div>
            ))}
            <div className={styles.buttonGroup}>
                <button onClick={() => navigate('/profile')} className={styles.cancelButton}>
                    Cancel
                </button>
                <button onClick={handleDelete} className={styles.deleteButton}>
                    Delete
                </button>
                <button onClick={handleSave} className={styles.saveButton}>
                    Save
                </button>
            </div>
        </div>
    );
}

export default EditPollQuiz;