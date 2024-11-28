import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import styles from "./EditProfile.module.css";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice.js"; // Ensure delete actions are imported
import { useNavigate } from "react-router-dom";


function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
    profilePicture: "",
  });
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [textUpdateSuccess, setTextUpdateSuccess] = useState(false);

  const inputRef = useRef();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  // Synchronize form data with current user
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        description: currentUser.description,
        profilePicture: currentUser.profilePicture,
      });
    }
  }, [currentUser]);

  /* Effect Image */
  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  useEffect(() => {
    if (!imageError && imagePercent === 100) {
      // Clear any error messages after a successful upload
      setImageError(false);
    }
  }, [imageError, imagePercent]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
        // File size validation (4 MB = 4 * 1024 * 1024 bytes)
        if (file.size > 4 * 1024 * 1024) {
            setImageError(true); // Set error state
            alert("File size must be less than 4 MB.");
            return; // Exit without setting the image
        }

        // File type validation (ensure it's an image)
        if (!file.type.startsWith("image/")) {
            setImageError(true); // Set error state
            alert("Only image files are allowed.");
            return; // Exit without setting the image
        }

        setImage(file); // Set the image for upload
        setImageError(false); // Reset the error state
    }
};

  const handleImageUpload = async (image) => {
    setImageError(false); // Reset error state for a new upload
    // console.log(image);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    // console.log(uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
        // console.log("upload progress: " + Math.round(progress)+"%");
      },
      (error) => {
        setImageError(true);
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // ใส่ข้อมูล picture เก็บลงใน state
          setFormData({ ...formData, profilePicture: downloadURL });
        });
        // console.log("Upload successful");
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setTextUpdateSuccess(true);
    } catch (error) {
      console.error("Update Error: ", error.message);
      dispatch(updateUserFailure(error));
    }
  };

  const handleCancel = () => {
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      description: currentUser.description || "",
      profilePicture: currentUser.profilePicture,
    });
    setImage(null);
    setImageError(false);
    setTextUpdateSuccess(false);
  };
  console.log("formData: ", formData);
  console.log("error state: ", error);

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        dispatch(deleteUserStart());
        const response = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
  
        const data = await response.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data));
          return;
        }
        dispatch(deleteUserSuccess());
        alert("Account deleted successfully.");
        // Ensure state is cleared and then redirect
        setTimeout(() => {
          navigate("/"); // redirect back to home page after a short delay
        }, 100); // short delay to ensure state has been reset
      } catch (error) {
        console.error("Delete Error: ", error.message);
        dispatch(deleteUserFailure(error.message));
      }
    }
  };

  return (
    <div className={styles.editProfile}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.pictureSection}>
          <div className={styles.profilePicContainer}>
            <div className={styles.imageWrapper}>
              <input
                type="file"
                ref={inputRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              {/* Image */}
              <img
                src={formData.profilePicture || currentUser.profilePicture}
                alt="Profile"
                className={styles.profilePic}
              />
              <div className={styles.hoverEffect}>
                <i
                  className="fas fa-edit"
                  onClick={() => inputRef.current.click()}
                >
                  Edit
                </i>
              </div>
            </div>
          </div>
          <p className={styles.image_status}>
            {imageError ? (
              <span className={styles.error_text}>
                Error uploading image (file size must be less than 4 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span
                className={styles.uploading_text}
              >{`Uploading: ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className={styles.success_text}>
                Image uploaded successfully
              </span>
            ) : (
              ""
            )}
          </p>
          <p className={styles.recommendationText}>
            Use a picture at least 100x100 pixels and less than 4MB.
          </p>
        </div>

        {/* Username */}
        <label className={styles.label}>Username</label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
        />

        {/* Email */}
        <label className={styles.label}>Email</label>
        <input
          type="text"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />

        {/* Password */}
        <label className={styles.label}>Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          className={styles.input}
        />

        {/* Description */}
        <label className={styles.label}>Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
        />

        {/* Button Group */}
        <div className={styles.buttonGroup}>
          <button onClick={handleCancel} className={styles.cancelButton}>
            Cancel
          </button>
  
          <button type="submit" className={styles.saveButton}>
            {loading ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
      
      {/* Delete Account */}
      <button className={styles.deleteAccountButton} onClick={handleDeleteAccount}>
        Delete Account
      </button>

      {/* State Update(error&success) */}

      <p className={styles.error_text}>{error && "Something went wrong"}</p>
      <p className={styles.success_text}>
        {textUpdateSuccess && "User is Updated successfully"}
      </p>
    </div>
  );
}

export default EditProfile;
