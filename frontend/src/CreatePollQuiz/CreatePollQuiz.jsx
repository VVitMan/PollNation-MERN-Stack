import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

function CreatePollQuiz() {
  const [type, setType] = useState('Poll'); // Default type is 'Poll'
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ text: '', correct: false, explanation: '' }]);
  const [message, setMessage] = useState('');

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].correct = value;
    setOptions(updatedOptions);
  };

  const handleExplanationChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].explanation = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', correct: false, explanation: '' }]);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    // Reset form fields when the type is changed
    setQuestion('');
    setOptions([{ text: '', correct: false, explanation: '' }]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/poll-and-quiz/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, type, options }),
        credentials: 'include', // Include credentials to send cookies
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Poll/Quiz created successfully!');
        // Reset form fields after successful submission
        setQuestion('');
        setOptions([{ text: '', correct: false, explanation: '' }]);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-poll-quiz-form">
      <h2>Create a Poll or Quiz</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <select value={type} onChange={handleTypeChange}>
            <option value="Poll">Poll</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>

        <div>
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {type === 'Quiz' && (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={option.correct}
                      onChange={(e) => handleCorrectChange(index, e.target.checked)}
                    />
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={option.explanation}
                    placeholder="Explanation (optional)"
                    onChange={(e) => handleExplanationChange(index, e.target.value)}
                  />
                </>
              )}
              {options.length > 1 && (
                <button type="button" onClick={() => removeOption(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption}>Add Option</button>
        </div>

        <button type="submit">Create {type}</button>
      </form>
    </div>
  );
}

export default CreatePollQuiz;
