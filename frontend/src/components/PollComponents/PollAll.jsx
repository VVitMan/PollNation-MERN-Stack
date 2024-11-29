import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Poll.module.css";
import { useSelector } from "react-redux";

function PollAll() {
  console.log("Poll All working...");
  const [pollQuizData, setPollQuizData] = useState([]); // Data for both polls and quizzes
  const [selectedOptions, setSelectedOptions] = useState({});
  const [comments, setComments] = useState({}); // Store comments dynamically for each post
  const [visibleComments, setVisibleComments] = useState({}); // Track visibility of comments for each post
  const [commentInputs, setCommentInputs] = useState({}); // Store comment inputs per post
  const [loadingPostId, setLoadingPostId] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);


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
        setPollQuizData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleComments = async (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle visibility for this postId
    }));

    // If comments are being shown and not already loaded, fetch them
    if (!visibleComments[postId] && !comments[postId]) {
      try {
        const response = await fetch(`/api/comments/find/posts/${postId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const postComments = await response.json();
        setComments((prev) => ({ ...prev, [postId]: postComments })); // Save comments for this postId
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser) {
      alert("Please log in to add a comment.");
      return;
    }
    if (commentInputs[postId]?.trim() === "") return;
    setLoadingPostId(postId); // Indicate which post is being processed

    try {
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          postId,
          content: commentInputs[postId], // Get the input for this postId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newComment = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment], // Append the new comment
      }));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" })); // Clear input for this postId
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoadingPostId(null); // Reset loading state
    }
  };

  const handleInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleOptionSelect = (pollIndex, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [pollIndex]: prev[pollIndex] === optionId ? null : optionId,
    }));
  };

  return (
    <>
      {pollQuizData.map((item, index) => (
        <div key={item._id} className={styles.card}>
          {/* Profile */}
          <div className={styles.cardHeader}>
            <img
              className={styles.cardImage}
              src={
                item.userId?.profilePicture ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              alt="Profile"
              onClick={() => navigate(`/profile/${item.userId?.username}`)}
            />
            <h2 className={styles.cardTitle}>{item.userId?.username}</h2>
          </div>
          <p className={styles.cardDescription}>{item.question}</p>
          <div className={styles.voteInfo}>
            {item.type === "Poll" ? (
              <>
                <p className={styles.voteCount}>
                  {item.options.reduce(
                    (total, option) => total + option.votes,
                    0
                  )}{" "}
                  Votes
                </p>
                <div className={styles.pollOptions}>
                  {item.options.map((option) => (
                    <div
                      key={option._id}
                      className={`${styles.option} ${
                        selectedOptions[index] === option._id
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(index, option._id)}
                    >
                      <input
                        type="radio"
                        name={`poll-${index}`}
                        value={option._id}
                        checked={selectedOptions[index] === option._id}
                        onChange={() => handleOptionSelect(index, option._id)}
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
                      key={option._id}
                      className={`${styles.option} ${
                        selectedOptions[index] === option._id
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(index, option._id)}
                    >
                      <input
                        type="radio"
                        name={`quiz-${index}`}
                        value={option._id}
                        checked={selectedOptions[index] === option._id}
                        onChange={() => handleOptionSelect(index, option._id)}
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
            onClick={() => toggleComments(item._id)} // Toggle comments dynamically
          >
            {visibleComments[item._id] ? "Hide Comments" : "View Comments"}
          </button>
          
          {/* Comments Section */}
          {visibleComments[item._id] && (
            <div className={styles.commentsContainer}>
              <h3 className={styles.commentsTitle}>Comments</h3>
              {comments[item._id]?.length === 0 ? (
                <p className={styles.noCommentsMessage}>
                  Be the first one to comment!
                </p>
              ) : (
                comments[item._id]?.map((comment) => (
                    <div key={comment._id} className={styles.commentItem}>
                    {console.log("profilePicture of user'comment",comment.userId?.profilePicture)}
                    <img
                        src={
                            comment.userId?.profilePicture && comment.userId.profilePicture.trim() !== ""
                            ? comment.userId.profilePicture
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                        alt="Profile"
                        className={styles.commentProfileImage}
                    />

                    <div className={styles.commentContent}>
                      <strong className={styles.commentAuthor}>
                        {comment.userId?.username || "Unknown"}
                      </strong>
                      <span>{comment.content}</span>
                    </div>
                  </div>
                ))
              )}
              <div className={styles.addComment}>
                <textarea
                  type="text"
                  value={commentInputs[item._id] || ""}
                  onChange={(e) => handleInputChange(item._id, e.target.value)}
                  placeholder="Write your comment..."
                  className={styles.commentInput}
                />
                <button
                  onClick={() => handleAddComment(item._id)}
                  className={styles.commentSubmitButton}
                  disabled={loadingPostId === item._id} // Disable button while submitting
                >
                  {loadingPostId === item._id ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default PollAll;
