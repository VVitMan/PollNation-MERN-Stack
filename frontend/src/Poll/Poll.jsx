import styles from './Poll.module.css'
import profilePic from '/Mary.jfif'

function Poll(){

    return(
        <>
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <img className={styles.cardImage} src={profilePic} alt="Profile" />
                <h2 className={styles.cardTitle}>Username</h2>
            </div>
            <p className={styles.cardDescription}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate omnis cupiditate harum, enim necessitatibus odio similique voluptas nostrum officia sit est commodi soluta quae reiciendis facilis neque nemo aliquam nam?
            </p>
            <div className={styles.voteInfo}>
                <p className={styles.voteCount}>300 Votes</p>
                <div className={styles.pollOptions}>
                    <div className={styles.option}>
                        <input type="radio" name="poll" />
                        <label>Option 1</label>
                    </div>
                    <div className={styles.option}>
                        <input type="radio" name="poll" />
                        <label>Option 2</label>
                    </div>
                    <div className={styles.option}>
                        <input type="radio" name="poll" />
                        <label>Option 3</label>
                    </div>
                    <div className={styles.option}>
                        <input type="radio" name="poll" />
                        <label>Option 4</label>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Poll