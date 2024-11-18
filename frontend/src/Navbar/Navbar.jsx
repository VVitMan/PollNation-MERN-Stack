import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [loading, setLoading] = useState(true); // Loading state
  const { currentUser } = useSelector((state) => state.user);

  // Simulate loading user data => loading
  useEffect(() => {
    // Simulating a delay for loading user data
    if (currentUser) {
      setLoading(false);
    }
  }, [currentUser]);

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
      <div className={styles.logo} onClick={() => handleLinkClick("Home")}>
        <Link to="/" className={styles.logoLink}>
          <b>PollNation</b>
        </Link>
      </div>

      <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
        <li
          key="Home"
          onClick={() => handleLinkClick("Home")}
          className={active === "Home" ? styles.active : ""}
        >
          <Link to="/">Home</Link>
        </li>

        {/* User Profile */}
        {loading ? (
          <li className={styles.loading}>Loading...</li>
        ) : currentUser ? (
          <li
            key="Profile"
            onClick={() => handleLinkClick("Profile")}
            className={active === "Profile" ? styles.active : ""}
          >
            <Link to={`/profile`}>{currentUser.username}</Link>
            {currentUser.profilePicture && (
              <img
                src={currentUser.profilePicture}
                alt="Profile"
                className={styles.profilePic}
              />
            )}
          </li>
        ) : (
          <li className={styles.signIn}>Sign In</li>
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
