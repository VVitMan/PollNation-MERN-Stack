import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for the dropdown
  const [loading, setLoading] = useState(true); // Loading state
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Simulate loading user data => loading
  useEffect(() => {
    setLoading(false);
  }, [currentUser]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  const handleLinkClick = (link) => {
    setActive(link);
    setIsOpen(false); // Close the menu after clicking a link on mobile
    setDropdownOpen(false); // Close the dropdown when navigating
  };

  const handleLogout = () => {
    dispatch(signOut());
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
          <li className={styles.profile}>
            <div onClick={toggleDropdown} className={styles.profileToggle}>
              <span>{currentUser?.username}</span>
              {currentUser.profilePicture && (
                <img
                  src={
                    currentUser?.profilePicture ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  alt="Profile"
                  className={styles.profilePic}
                />
              )}
              <span className={styles.arrow}>
                {dropdownOpen ? "▲" : "▼"}
              </span>
            </div>
            {dropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <Link to={`/profile/${currentUser?.username}`}><li>
                  Profile
                </li></Link>
                <li onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li
            key="SignIn"
            onClick={() => handleLinkClick("Sign In")}
            className={styles.signIn}
          >
            <Link to="/sign-in">Sign In</Link>
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
