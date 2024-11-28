import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from "../redux/user/userSlice.js";
import styles from "./ProfilePage.module.css";

export default function Profile() {
  /* Current User Instance */
  const { currentUser, loading, error } = useSelector((state) => state.user);
  /* UseRef */
  const inputRef = useRef();
  /* State Image */
  const [image, setImage] = useState(undefined);
  /* Percentage Image */
  const [imagePercent, setImagePercent] = useState(0);
  /* Error Image */
  const [imageError, setImageError] = useState(false);
  /* Form Data */
  const [formData, setFormData] = useState({});
  /* Dispatch */
  const dispatch = useDispatch();
  /* Text update success state */
  const [textUpdateSuccess, setTextUpdateSuccess] = useState(false);

  /* Effect Image */
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]); // when image(state) is changed useEffect will be called

  /* Handle file Picture upload *////////////////////////////////////////////////////////////////
  const handleFileUpload = async (image) => {
    // console.log(image); 
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    // console.log(uploadTask);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
        // console.log("upload progress: " + Math.round(progress)+"%");
      },
      (error) => {
        setImageError(true);
        // console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // ใส่ข้อมูล picture เก็บลงใน state 
          setFormData({...formData, profilePicture: downloadURL});
        });
        // console.log("Upload successful");
      }
    );
  }

  /* Handle Change input(username, email, password) *//////////////////////////////
  const handleChange = (e) => {
    // ใส่ข้อมูลจาก onChange ทั้งหมด ลงใน state 
    setFormData({...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  /* HandleSubmit data to API */ //////////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setTextUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  /* Handle Delete User */
  const handleDeleteAccount = async (e) => {
    try {
      dispatch(deleteUserStart);
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout')
      dispatch(signOut());
    } catch (error) {
      console.error('Error signing out', error);
      
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* File, image file only */}
        <input type="file" ref={inputRef} hidden accept="image/.*"
        onChange={(e) => setImage(e.target.files[0])}/>
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          /* if click will call inputRef */
          onClick={() => inputRef.current.click()}
        />

        {/* Status Upload */}
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>

        <input
          type="text"
          defaultValue={currentUser.username}
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="text"
          defaultValue={currentUser.email}
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />

        {/* Update Button and Loading...*/}
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>

      {/* Delete and Sign out */}    
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      {/* State Update(error&success) */}
      <p className="text-red-700 mt-5">{error && 'Something went wrong'}</p>
      <p className="text-green-700 mt-5">{textUpdateSuccess && 'User is Updated successfully'}</p>
      
    </div>
  );
}
