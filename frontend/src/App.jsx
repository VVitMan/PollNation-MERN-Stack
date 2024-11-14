// Vit
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Header from "./components/Header";
import Poll from "./Poll/Poll";
import PrivateRoute from "./components/PrivateRoute";
// Perth
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './Navbar/Navbar.jsx';
// import Poll from './Poll/Poll.jsx';
// import ProfilePage from './ProfilePage/ProfilePage.jsx'; // Import the ProfilePage component
// import EditProfile from './EditProfile/EditProfile.jsx';


export default function App() {
  return (
// Vit
    <BrowserRouter>
      {/* Header */}
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          <Route path="/community" element={<Community />} />
          {/* Poll */}
          <Route path="/poll" element={<Poll />} />
        </Routes>
    </BrowserRouter>
// Perth
//     <Router>
//       <div className="main-container">
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Poll />} /> {/* Main Poll Page */}
//         <Route path="/profile/:username" element={<ProfilePage />} /> {/* Profile Page */}
//         <Route path='/edit-profile' element={<EditProfile />}></Route> {/* Edit Profile Page */}
//       </Routes>
//       </div>
//     </Router>

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
