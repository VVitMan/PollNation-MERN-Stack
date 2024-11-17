import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx';
import Poll from './Poll/Poll.jsx';
import ProfilePage from './ProfilePage/ProfilePage.jsx'; // Import the ProfilePage component
import EditProfile from './EditProfile/EditProfile.jsx';
import CreateEditPoll from './CreateEditPoll/CreateEditPoll.jsx';

// Vit
import Home from "./pages/Home";
import SignUp from "../SignUp/Signup.jsx";
import SignIn from "../SignIn/SignIn.jsx";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <div className="main-container">

        
        {/* Vit Navbar Component */}
        <Header />

        {/* Navbar Component */}
        <Navbar />

        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Poll />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/community" element={<Community />} />

          {/* Poll Routes */}
          <Route path="/profile/:username" element={<ProfilePage />} /> {/* Profile Page */}
          <Route path="/edit-profile" element={<EditProfile />} /> {/* Edit Profile Page */}
          <Route path="/edit-poll/:pollId" element={<CreateEditPoll />} /> {/* Edit/Create Poll Page */}
        </Routes>
      </div>
    </Router>
  );
}
