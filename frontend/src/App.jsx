import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx';
// import Poll from './Poll/Poll.jsx';
import ProfilePage from './ProfilePage/ProfilePage.jsx'; // Import the ProfilePage component
import EditProfile from './EditProfile/EditProfile.jsx';
import CreateEditPoll from './CreateEditPoll/CreateEditPoll.jsx';
import PollAll from './components/PollComponents/PollAll.jsx';

// Vit
import SignIn from "./SignIn/SignIn.jsx";
import SignUp from './SignUp/SignUp.jsx';
import Profile from "./Profile/Profile.jsx";
import Community from "./pages/Community";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <div className="main-container">

        <br />
        <br />
        
        {/* Navbar Component */}
        <Navbar />

        
        <br />
        <br />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<PollAll/>} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>

          <Route path="/community" element={<Community />} />

          {/* Poll Routes */}
          <Route path="/profile/:username" element={<ProfilePage />} /> {/* Profile Page */}
          <Route path="/edit-profile" element={<EditProfile />} /> {/* Edit Profile Page */}
          <Route path="/edit/poll-and-quiz/:id" element={<CreateEditPoll />} /> {/* Edit/Create Poll Page */}
        </Routes>
      </div>
    </Router>
  );
}
