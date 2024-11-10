import { useState } from 'react';
import styles from './Navbar.module.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState('Home');

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>PollNation</div>
            <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
                {['Home', 'My Profile', 'Community'].map((link) => (
                    <li 
                        key={link} 
                        onClick={() => setActive(link)} 
                        className={active === link ? styles.active : ''}
                    >
                        <a href={`#${link.toLowerCase().replace(' ', '-')}`}>{link}</a>
                    </li>
                ))}
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
