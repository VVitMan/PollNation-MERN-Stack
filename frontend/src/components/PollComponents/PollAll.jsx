import { useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Poll.module.css";
import { useSelector } from "react-redux";
// import { signOut } from "../../redux/user/userSlice";

function PollAll() {
  const [pollQuizData, setPollQuizData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [loadingPostId, setLoadingPostId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingContent, setEditingContent] = useState({});
  const [editingLoading, setEditingLoading] = useState(false);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.currentUser); // Adjust based on your state structure

  const [answeredOptionData, setAnsweredOptionData] = useState([]); // All OptionIDs that this user has answered
  const [answeredQuestionData, setAnsweredQuestionData] = useState([]); // All QuestionIDs that this user has answered
  const [voteCounts, setVoteCounts] = useState([]);

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
        
        const text = await response.text();
        const data = text ? JSON.parse(text) : null; // Parse only if there's content

        console.log("setPollQuizData(data);",data);
        setPollQuizData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOptionSelect = async (postId, optionId) => {
    const userId = currentUser?._id; // Extract user ID from Redux state
  
    // Debugging logs for tracking inputs
    console.log("User ID:", userId);
    console.log("Poll ID:", postId);
    console.log("Option ID:", optionId);
  
    try {
      if (!userId) {
        console.error("User not authenticated or missing userId.");
        navigate("/sign-in")
        return;
      }
  
      // Send the request to the new unified endpoint
      const response = await fetch("/api/vote/voting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          postId,
          optionId,
        }),
      });
  
      // Debugging log for the response status
      console.log("Response Status:", response.status);
  
      if (!response.ok) {
        const errorMessage = await response.text(); // Get detailed error message from server
        throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
      }
  
      // Parse and log the response body (optional for debugging)
      const text = await response.text();
      console.log("Raw response text:", text);
      const responseData = text ? JSON.parse(text) : null; // Parse only if there's content

      console.log("Response Data:", responseData);
  
      // Refresh the selected options
      preSelectOptions();
    } catch (error) {
      console.error("Error handling vote:", error.message);
    }
  };
  
const preSelectOptions = async () => {
  try {
    console.log("**************** Load Selected Options called! **************** ")
    const response = await fetch("/api/vote/myanswers", {
      method: "GET",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${currentUser?.token}`,
      },
    });


    
    if (!response.ok) {
      console.warn("No votes found for the user. Setting default empty state.");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    if (response.status === 204) { //204 No content
      // Handle case where no votes are found
      console.warn("No votes found for the user. Setting default empty state.");
      setAnsweredOptionData([]);
      setAnsweredQuestionData([]);
      setVoteCounts([]); // Option counts and details
      return;
    }
    
    console.log("const data = await response.json();")

    const text = await response.text();
    const data = text ? JSON.parse(text) : null; // Parse only if there's content

    setAnsweredOptionData(data.allOptionIdData);
    setAnsweredQuestionData(data.allQuestionIdData);
    setVoteCounts(data.voteCounts); // Option counts and details
    console.log("setAnsweredOptionData(: ", data.allOptionIdData)
    console.log("setAnsweredOptionData: ", data.allQuestionIdData)
    console.log("setVoteCounts: ", data.voteCounts)
  } catch (error) {
    console.error("Error fetching allOptionIdData:", error);
  }
};

// initial load
useEffect(() => {
  const initializeOptions = async () => {
    await preSelectOptions();
  };
  initializeOptions();
}, [currentUser]);

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
    if (!currentUser) {
      alert("Please log in to add a comment.");
      return;
    }

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

  const handleDeleteComment = async (postId, commentId) => {

    if (!currentUser) {
      alert("Please log in to delete a comment.");
      return;
    }

    // Show confirmation alert
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    );

    // If user cancels, exit the function
    if (!confirmDelete) {
      return;
    }
    setDeletingCommentId(commentId);
    try {
      const response = await fetch(`/api/comments/delete/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((comment) => comment._id !== commentId),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleEditComment = async (postId, commentId) => {

    if (!currentUser) {
      alert("Please log in to edit a comment.");
      return;
    }

    if (!editingContent[commentId]?.trim()) {
      alert("Comment content cannot be empty.");
      return;
    }

    setEditingLoading(true);

    try {
      const response = await fetch(`/api/comments/edit/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: editingContent[commentId] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedComment = await response.json();

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        ),
      }));

      setEditingComment(null);
      setEditingContent((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Error editing comment:", error);
    } finally {
      setEditingLoading(false);
    }
  };

  const handleEditInputChange = (commentId, value) => {
    setEditingContent((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  useEffect(() => {
  if (!currentUser) {
    // Clear states if no user is logged in
    setAnsweredOptionData([]);
    setAnsweredQuestionData([]);
    setVoteCounts([]);
    return;
  }

  // Fetch user's answers if logged in
  const fetchAnswers = async () => {
    try {
      const response = await fetch("/api/vote/myanswers", {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${currentUser.token}`,
        },
      });
      if (response.ok && response.status !== 204) {
        const { allOptionIdData, allQuestionIdData, voteCounts } = await response.json();
        setAnsweredOptionData(allOptionIdData);
        setAnsweredQuestionData(allQuestionIdData);
        setVoteCounts(voteCounts);
      } else {
        console.warn("Failed to fetch answers:", response.status);
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  fetchAnswers();
}, [currentUser]);

return (
  <>
    {pollQuizData.map((item) => {
      // Calculate total votes for this item (poll or quiz)
      const totalVotes = item.options.reduce((total, option) => {
        const optionVote = voteCounts.find((vc) => vc._id === option._id);
        return total + (optionVote?.count || 0);
      }, 0);

      const userAnsweredThisQuestion =
        currentUser && answeredQuestionData.includes(item._id);

      return (
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
            {/* Display "?" votes if no user interaction */}
            <p className={styles.voteCount}>
              {item.type === "Quiz"
                ? `${userAnsweredThisQuestion ? totalVotes : "?"} Answered`
                : `${totalVotes > 0 ? totalVotes : "?"} Votes`}
            </p>

            <div className={styles.pollOptions}>
              {item.options.map((option) => {
                const optionVote = voteCounts.find(
                  (vc) => vc._id === option._id
                );
                const votePercentage =
                  totalVotes > 0
                    ? (optionVote?.count / totalVotes) * 100
                    : 0;

                let optionClass = "";

                if (item.type === "Quiz" && currentUser) {
                  if (userAnsweredThisQuestion) {
                    if (answeredOptionData.includes(option._id)) {
                      optionClass = option.correct
                        ? styles.correct // User selected the correct option
                        : styles.wrong; // User selected the wrong option
                    } else if (option.correct) {
                      optionClass = styles.showCorrect; // Highlight the correct option
                    } else {
                      optionClass = styles.notSelected; // Other unselected options
                    }
                  } else {
                    // If the user hasn't answered this question
                    optionClass = styles.notSelected;
                  }
                } else if (item.type === "Poll" && currentUser) {
                  optionClass = answeredQuestionData.includes(item._id)
                    ? answeredOptionData.includes(option._id)
                      ? styles.selected
                      : styles.notSelected
                    : "";
                }

                return (
                  <div
                    key={option._id}
                    className={`${styles.option} ${optionClass}`}
                    style={{
                      "--vote-percentage": `${votePercentage}%`,
                    }}
                    onClick={() =>
                      currentUser &&
                      handleOptionSelect(item._id, option._id) //, item.type
                    }
                  >
                    <label>
                      {option.text}
                      {item.type === "Poll" &&
                        optionVote?.count !== undefined &&
                        ` (${optionVote.count})`}
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

                      {editingComment === comment._id ? (
                        <>
                          <textarea
                            value={
                              editingContent[comment._id] !== undefined
                                ? editingContent[comment._id]
                                : comment.content
                            }
                            onChange={(e) =>
                              handleEditInputChange(comment._id, e.target.value)
                            }
                            className={styles.editCommentInput}
                          />
                          <button
                            onClick={() =>
                              handleEditComment(item._id, comment._id)
                            }
                            className={styles.commentEditSaveButton}
                            disabled={editingLoading}
                          >
                            {editingLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            className={styles.commentEditCancelButton}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span>{comment.content}</span>
                      )}
                    </div>

                    {currentUser && currentUser._id === comment.userId?._id && (
                      <>
                        <button
                          onClick={() => setEditingComment(comment._id)}
                          className={styles.commentEditButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteComment(item._id, comment._id)
                          }
                          className={styles.commentDeleteButton}
                          disabled={deletingCommentId === comment._id}
                        >
                          {deletingCommentId === comment._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </>
                    )}
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
      );
    })}
  </>
);

} export default PollAll;

