import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";

function Navbar() {
  console.log("Navbar is rendering...");

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for the dropdown
  const { currentUser } = useSelector((state) => state.user); // Redux state for user
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo} onClick={() => setIsOpen(false)}>
        <Link to="/" className={styles.logoLink}>
          <b>PollNation</b>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
        {/* Always Visible Links */}
        <li className={styles.navItem}>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </li>

        {currentUser && currentUser.isAdmin && ( // Conditionally show Admin link
          <li className={styles.navItem}>
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
              Admin
            </Link>
          </li>
        )}


        {currentUser ? (
          // Logged-in User Links

        {/* User Profile */}
        {loading ? (
          <li className={styles.loading}>Loading...</li>
        ) : currentUser ? (
          <li className={styles.profile}>
            <div onClick={toggleDropdown} className={styles.profileToggle}>
              <span>{currentUser.username}</span>
              <img
                src={
                  currentUser.profilePicture ||
                  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                }
                alt="Profile"
                className={styles.profilePic}
              />
              <span className={styles.arrow}>
                {dropdownOpen ? "▲" : "▼"}
              </span>
            </div>
            {dropdownOpen && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link to={`/profile/${currentUser.username}`}>
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
          // Logged-out User Link
          <li>
            <Link to="/sign-in" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
          </li>
        )}
      </ul>

      {/* Hamburger Icon for Mobile */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>
    </nav>
  );
}

export default Navbar;
