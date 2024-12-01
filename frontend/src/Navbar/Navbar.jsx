import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle
  const { currentUser, loading } = useSelector((state) => state.user); // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Navigate after logout

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    dispatch(signOut()); // Trigger Redux logout
    setDropdownOpen(false); // Close dropdown
    navigate("/"); // Redirect to home
  };

  const closeMenu = () => {
    setIsOpen(false); // Close mobile menu
    setDropdownOpen(false); // Close dropdown
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo} onClick={closeMenu}>
        <Link to="/" className={styles.logoLink}>
          <b>PollNation</b>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
        {/* Always Visible Links */}
        <li className={styles.navItem}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>

        {currentUser?.isAdmin && ( // Conditionally show Admin link
          <li className={styles.navItem}>
            <Link to="/admin/dashboard" onClick={closeMenu}>
              Admin
            </Link>
          </li>
        )}

        {/* User Profile or Sign-In */}
        {loading ? (
          <li className={styles.loading}>Loading...</li>
        ) : currentUser ? (
          <li className={styles.profile}>
            <div
              onClick={toggleDropdown}
              className={styles.profileToggle}
              aria-expanded={dropdownOpen}
            >
              <span>{currentUser.username}</span>
              <img
                src={
                  currentUser.profilePicture ||
                  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                }
                alt="Profile"
                className={styles.profilePic}
              />
              <span className={styles.arrow}>{dropdownOpen ? "▲" : "▼"}</span>
            </div>
            {dropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link to={`/profile/${currentUser.username}`} onClick={closeMenu}>
                    Profile
                  </Link>
                </li>
                <li onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>
            <Link to="/sign-in" onClick={closeMenu}>
              Sign In
            </Link>
          </li>
        )}
      </ul>

      {/* Hamburger Icon for Mobile */}
      <div
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-expanded={isOpen}
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>
    </nav>
  );
}

export default Navbar;
