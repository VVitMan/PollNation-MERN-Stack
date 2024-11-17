import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState('Home');
    const [currentUser, setCurrentUser] = useState(null); // State for current user data

    useEffect(() => {
        // Mock fetch for current user data
        const fetchCurrentUser = async () => {
            // Simulate a delay to mock an API call
            setTimeout(() => {
                const mockUserData = {
                    username: "Unknown",
                    profilePic: "/Unknown.png" // Ensure this image is available in your public folder
                };
                setCurrentUser(mockUserData);
            }, 1000); // 1-second delay
        };

        fetchCurrentUser();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = (link) => {
        setActive(link);
        setIsOpen(false); // Close the menu after clicking a link on mobile
    };

    return (
        <nav className={styles.navbar}>
            {/* PollNation Logo */}
            <div className={styles.logo} onClick={() => handleLinkClick('Home')}>
                <Link to="/" className={styles.logoLink}><b>PollNation</b></Link>
            </div>

            <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
                <li
                    key="Home"
                    onClick={() => handleLinkClick("Home")}
                    className={active === "Home" ? styles.active : ''}
                >
                    <Link to="/">Home</Link>
                </li>
                <li
                    key="Community"
                    onClick={() => handleLinkClick("Community")}
                    className={active === "Community" ? styles.active : ''}
                >
                    <Link to="/community">Community</Link>
                </li>

                {/* User Profile */}
                {currentUser ? (
                    <li
                        key="Profile"
                        onClick={() => handleLinkClick("rofile")}
                        className={active === "Profile" ? styles.active : ''}
                    >
                        <Link to={`/profile`}>
                            My Profile ({currentUser.username})
                        </Link>
                        {currentUser.profilePic && (
                            <img
                                src={currentUser.profilePic}
                                alt="Profile"
                                className={styles.profilePic}
                            />
                        )}
                    </li>
                ) : (
                    <li key="Loading" className={styles.loading}>
                        Loading...
                    </li>
                )}
            </ul>
            <div className={styles.hamburger} onClick={toggleMenu}>
                <span className={styles.line}></span>
                <span className={styles.line}></span>
                <span className={styles.line}></span>
            </div>
        </nav>
    );
}

export default Navbar;
