import { useEffect, useState, useRef} from "react";
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

  const [answeredOptionData, setOptionData] = useState([]);


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

  const handleOptionSelect = async (pollIndex, postId, optionId) => {
    const selectedOption = selectedOptions[pollIndex];
    const token = currentUser?.token; // Get token for authentication
    const userId = currentUser?._id; // Extract user ID from Redux state
  
    // Find the index of the selected option
    const optionIndex = pollQuizData[pollIndex].options.findIndex(
      (option) => option._id === optionId
    );
  
    if (optionIndex === -1) {
      console.error("Invalid option selected");
      return;
    }
  
    try {
      if (selectedOption === optionId) {
        // Cancel vote
        await fetch("/api/vote/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, pollId: postId }),
        });
  
        preSelectOptions(); // Refresh the selected options
      } else if (selectedOption == null) {
        // Create vote
        await fetch("/api/vote/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            pollId: postId,
            optionId,
            type: "Poll",
          }),
        });
  
        preSelectOptions(); // Refresh the selected options
      } else {
        // Update vote
        await fetch("/api/vote/change", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            pollId: postId,
            optionId,
          }),
        });
  
        preSelectOptions(); // Refresh the selected options
      }
    } catch (error) {
      console.error("Error handling vote:", error);
    }
  };
  



const preSelectOptions = async () => {
  try {
    console.log("Load Selected Options called!")
    const response = await fetch("/api/vote/myanswers", {
      method: "GET",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${currentUser.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const allOptionIdData = await response.json();
    setOptionData(allOptionIdData);
  } catch (error) {
    console.error("Error fetching allOptionIdData:", error);
  }
};

const preSelectOptionsCalled = useRef(false); // Track whether preSelectOptions has been called
useEffect(() => {
  

  const initializeOptions = async () => {
    if (!currentUser?.token) {
      console.log("Waiting for currentUser.token...");
      return;
    }

    if (preSelectOptionsCalled.current) {
      // Skip if already called
      console.log("preSelectOptions has already been called.");
      return;
    }

    console.log("Token is ready. Calling preSelectOptions...");
    await preSelectOptions();
    preSelectOptionsCalled.current = true; // Mark as called
  };

  preSelectOptions();
}, [currentUser?.token]);

useEffect(() => {
  console.log("Current User at initial load:", currentUser);
}, [currentUser]);






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
              {item.options.reduce((total, option) => total + option.votes, 0)} Votes
            </p>
            <div className={styles.pollOptions}>
              {item.options.map((option, optionIndex) => (
                <div
                  key={option._id}
                  className={`${styles.option} ${
                    answeredOptionData.includes(option._id) ? styles.selected : ""
                  }`}
                  onClick={() => handleOptionSelect(index, item._id, option._id)}
                >
                  <label>{option.text}: {option.votes}</label>
                </div>
              ))}
            </div>


                {answeredOptionData.map((optionId) => (
                  
                  <div key={optionId}>
                    <input
                      type="radio"
                      name={`poll-${item._id}`}
                      value={optionId} // Use optionId instead of option._id
                      checked={optionId === selectedOptions[item._id]} // Compare optionId with the selected option for this poll
                      onChange={() => handleOptionSelect(item._id, optionId)} // Pass optionId directly
                    />
                  </div>
                ))}
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
