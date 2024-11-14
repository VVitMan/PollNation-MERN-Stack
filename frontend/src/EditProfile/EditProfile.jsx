import { useState } from 'react';
import styles from './EditProfile.module.css';

function EditProfile() {
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [profilePic, setProfilePic] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 4 * 1024 * 1024) { // Limit to 4MB
            setProfilePic(URL.createObjectURL(file));
        } else {
            alert("Please select an image under 4MB.");
        }
    };

    const handleSave = () => {
        // Logic to save/update profile details
        console.log('Profile updated:', { username, description, profilePic });
    };

    const handleCancel = () => {
        // Logic to reset or redirect if needed
        setUsername('');
        setDescription('');
        setProfilePic(null);
    };

    return (
        <div className={styles.editProfile}>
            <h1>Edit Profile</h1>
            
            <div className={styles.pictureSection}>
                <div className={styles.profilePicContainer}>
                    <img 
                        src={profilePic || '/default-avatar.png'} 
                        alt="Profile" 
                        className={styles.profilePic} 
                    />
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className={styles.uploadInput}
                />
                <button className={styles.uploadButton}>Upload</button>
                <p>It's recommended that you use a picture that's at least 100x100 pixels and 4MB or less.</p>
            </div>
            
            <label className={styles.label}>Username</label>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className={styles.input}
            />

            <label className={styles.label}>Description</label>
            <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className={styles.textarea}
            />

            <div className={styles.buttonGroup}>
                <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                <button onClick={handleSave} className={styles.saveButton}>Save</button>
            </div>
        </div>
    );
}

export default EditProfile;
