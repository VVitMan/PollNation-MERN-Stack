import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Community from "./pages/Community";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './Navbar/Navbar.jsx';
// import Poll from './Poll/Poll.jsx';
// import ProfilePage from './ProfilePage/ProfilePage.jsx'; // Import the ProfilePage component

// function App() {
//   return (
//     <Router>
//       <div className="main-container">
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Poll />} /> Main Poll Page
//         <Route path="/profile/:username" element={<ProfilePage />} /> {/* Profile Page */}
//       </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
