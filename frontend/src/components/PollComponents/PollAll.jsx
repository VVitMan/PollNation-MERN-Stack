import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Poll.module.css";
import { useSelector } from "react-redux";

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
    if (currentUser.isBanned) {
      alert("You are banned and cannot add comments.");
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
                        comment.userId?.profilePicture?.trim()
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
                            value={editingContent[comment._id] || comment.content}
                            onChange={(e) =>
                              handleEditInputChange(comment._id, e.target.value)
                            }
                            className={styles.editCommentInput}
                          />
                          <button
                            onClick={() => handleEditComment(item._id, comment._id)}
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
                  onChange={(e) => handleInputChange(item._id, e.target.value)}
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
