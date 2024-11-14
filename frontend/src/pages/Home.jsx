export default function Home() {
  return (
    <div>Home</div>
  )
}

// // File: src/pages/Home.jsx
// import { useState, useEffect } from 'react';

// // Home Component
// function Home() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('user'));
//     if (userData) {
//       setUser(userData);
//     } else {
//       window.location.href = '/login';
//     }
//   }, []);

//   return (
//     <div className="home-container">
//       <nav>
//         {user && (
//           <div className="user-info">
//             <img src={user.profilePicture || '/default-profile.jpg'} alt="Profile" className="profile-picture" />
//             <span>{user.firstName} {user.lastName}</span>
//           </div>
//         )}
//       </nav>
//       <h2>Welcome to Your Dashboard</h2>
//       <a href="/questions">Manage Your Questions</a>
//     </div>
//   );
// }

// export default Home;