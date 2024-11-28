// Frontend Component for Editing Poll/Quiz (EditPollQuiz.jsx)
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditPollQuiz.module.css";

function EditPollQuiz() {
  const { postId } = useParams();
  const [type, setType] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", correct: false, explanation: "" },
  ]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing poll or quiz data
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/poll-and-quiz/find/${postId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials to send cookies
        });
        const data = await response.json();

        if (response.ok) {
          setType(data.__t || "Poll"); // Set type based on discriminator key or default to 'Poll'
          setQuestion(data.question);
          setOptions(data.options);
        } else {
          setMessage(`Error: ${data.message}`);
        }
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchData();
  }, [postId]);

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
    setOptions([...options, { text: "", correct: false, explanation: "" }]);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/poll-and-quiz/update/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, options }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Poll/Quiz updated successfully!`);
        navigate("/"); // Redirect to home after successful update
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.createPollQuizForm}>
      <h2 className={styles.header}>Edit {type}</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Question:</label>
          <input
            className={styles.input}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Options:</label>
          {options.map((option, index) => (
            <div className={styles.option} key={index}>
              <input
                className={styles.optionInput}
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {type === "Quiz" && (
                <>
                  <label className={styles.correctCheckbox}>
                    <input
                      type="checkbox"
                      checked={option.correct}
                      onChange={(e) =>
                        handleCorrectChange(index, e.target.checked)
                      }
                    />
                    Correct Answer
                  </label>
                  <input
                    className={styles.explanationInput}
                    type="text"
                    value={option.explanation}
                    placeholder="Explanation (optional)"
                    onChange={(e) =>
                      handleExplanationChange(index, e.target.value)
                    }
                  />
                </>
              )}
              {options.length > 1 && (
                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            className={styles.addOptionButton}
            type="button"
            onClick={addOption}
          >
            Add Option
          </button>
        </div>

        <button className={styles.submitButton} type="submit">
          Update {type}
        </button>
      </form>
    </div>
  );
}

export default EditPollQuiz;