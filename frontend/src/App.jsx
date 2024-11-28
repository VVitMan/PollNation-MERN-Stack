import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx';
// import Poll from './Poll/Poll.jsx';
import ProfilePage from './ProfilePage/ProfilePage.jsx'; // Import the ProfilePage component
import EditProfile from './EditProfile/EditProfile.jsx';
// import CreateEditPoll from './CreateEditPoll/CreateEditPoll.jsx';
import PollAll from './components/PollComponents/PollAll.jsx';

// Vit
import SignIn from "./SignIn/SignIn.jsx";
import SignUp from './SignUp/SignUp.jsx';
// import Profile from "./Profile [unuse]/Profile.jsx";
import Community from "./pages/Community";
import PrivateRoute from "./components/PrivateRoute";
import EditPollQuiz from './EditPollQuiz/EditPollQuiz.jsx'; // Import the EditPollQuiz component
import CreatePollAndQuiz from './CreatePollQuiz/CreatePollQuiz.jsx';
import Admin from './AdminPanel/AdminPanel.jsx';

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
          <Route path="/update/poll-and-quiz/:postId" element={<EditPollQuiz />} /> {/* Edit/Poll Quiz Page */}
          <Route path="/create/poll-and-quiz" element={<CreatePollAndQuiz />} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </div>
    </Router>
  );
}
