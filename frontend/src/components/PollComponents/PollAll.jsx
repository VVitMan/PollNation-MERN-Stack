import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Poll.module.css";

function PollAll() {
  const [pollQuizData, setPollQuizData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [loadingPostId, setLoadingPostId] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser); // Adjust based on your state structure


  useEffect(() => {
    const fetchData = async () => {
      try {
          const pollResponse = await fetch("/api/poll-and-quiz/all", {
              method: "GET",
              credentials: "include",
          });
  
          if (!pollResponse.ok) {
              throw new Error(`HTTP error! Status: ${pollResponse.status}`);
          }
  
          const pollData = await pollResponse.json();
          setPollQuizData(pollData);
  
          const token = localStorage.getItem("token") || currentUser?.token;
          const voteResponse = await fetch("/api/vote/user", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              credentials: "include",
          });
  
          if (!voteResponse.ok) {
              throw new Error(`HTTP error! Status: ${voteResponse.status}`);
          }
  
          const votes = await voteResponse.json();
  
          const userVotes = {};
          votes.forEach((vote) => {
              const poll = pollData.find((p) => p._id === vote.pollId);
              if (poll) {
                  userVotes[vote.pollId] = poll.options[vote.optionIndex]._id;
              }
          });
  
          setSelectedOptions(userVotes);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };
  

    fetchData();
}, []);


const handleOptionSelect = async (pollIndex, postId, optionId) => {
  const selectedOption = selectedOptions[postId];
  const token = localStorage.getItem("token") || currentUser?.token; // Get token for authentication
  const userId = currentUser?._id; // Extract user ID from Redux state

  // Prevent duplicate voting
  if (selectedOption === optionId) {
      console.log("You already voted for this option");
      return;
  }

  // Find the index of the selected option
  const optionIndex = pollQuizData[pollIndex].options.findIndex(
      (option) => option._id === optionId
  );

  if (optionIndex === -1) {
      console.error("Invalid option selected");
      return;
  }

  try {
      if (!selectedOption) {
          // Create vote
          await fetch("/api/vote", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                  userId,
                  pollId: postId,
                  optionIndex, // Use index instead of ID
                  type: "Poll",
              }),
          });

          // Update state to reflect the new vote
          setPollQuizData((prevData) => {
              const updatedData = [...prevData];
              updatedData[pollIndex].options[optionIndex].votes += 1; // Increase votes
              return updatedData;
          });

          setSelectedOptions((prev) => ({ ...prev, [postId]: optionId }));
      } else {
          // Update vote
          await fetch("/api/vote", {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                  userId,
                  pollId: postId,
                  optionIndex, // Use index instead of ID
              }),
          });

          // Update vote counts
          setPollQuizData((prevData) => {
              const updatedData = [...prevData];
              const previousOptionIndex = pollQuizData[pollIndex].options.findIndex(
                  (option) => option._id === selectedOption
              );
              updatedData[pollIndex].options[previousOptionIndex].votes -= 1; // Decrease previous option votes
              updatedData[pollIndex].options[optionIndex].votes += 1; // Increase new option votes
              return updatedData;
          });

          setSelectedOptions((prev) => ({ ...prev, [postId]: optionId }));
      }
  } catch (error) {
      console.error("Error handling vote:", error);
  }
};

  const toggleComments = async (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

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
        setComments((prev) => ({ ...prev, [postId]: postComments }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (commentInputs[postId]?.trim() === "") return;
    setLoadingPostId(postId);

    try {
      const response = await fetch("/api/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          postId,
          content: commentInputs[postId],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newComment = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoadingPostId(null);
    }
  };

  const handleInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  return (
    <>
      {pollQuizData.map((item, index) => (
        <div key={item._id} className={styles.card}>
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
            <p className={styles.voteCount}>
              {item.options.reduce((total, option) => total + option.votes, 0)}{" "}
              Votes
            </p>

            <div className={styles.pollOptions}>
              {item.options.map((option, optionIndex) => {
                  const totalVotes = item.options.reduce((total, opt) => total + opt.votes, 0);
                  const votePercentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                  return (
                      <div
                          key={option._id}
                          className={`${styles.option} ${
                              selectedOptions[item._id] === option._id ? styles.selected : ""
                          }`}
                          onClick={() => handleOptionSelect(index, item._id, option._id)}
                          style={{ '--percentage': votePercentage }}
                      >
                          <input
                              type="radio"
                              name={`poll-${index}`}
                              value={option._id}
                              checked={selectedOptions[item._id] === option._id} // Preselect based on user's vote
                              onChange={() =>
                                  handleOptionSelect(index, item._id, option._id)
                              }
                          />
                          <label>
                              {option.text} ({votePercentage}%)
                          </label>
                      </div>
                  );
              })}
          </div>





          </div>
          <button
            className={styles.viewCommentsButton}
            onClick={() => toggleComments(item._id)}
          >
            {visibleComments[item._id] ? "Hide Comments" : "View Comments"}
          </button>
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
                    <img
                      src={
                        comment.userId?.profilePicture &&
                        comment.userId.profilePicture.trim() !== ""
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
                  onChange={(e) =>
                    handleInputChange(item._id, e.target.value)
                  }
                  placeholder="Write your comment..."
                  className={styles.commentInput}
                />
                <button
                  onClick={() => handleAddComment(item._id)}
                  className={styles.commentSubmitButton}
                  disabled={loadingPostId === item._id}
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
