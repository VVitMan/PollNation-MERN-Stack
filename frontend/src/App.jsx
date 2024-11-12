import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx';
import Poll from './Poll/Poll.jsx';
import ProfilePage from './ProfilePage/ProfilePage.jsx'; // Import the ProfilePage component

function App() {
  return (
    <Router>
      <div className="main-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Poll />} /> Main Poll Page
        <Route path="/profile/:username" element={<ProfilePage />} /> {/* Profile Page */}
      </Routes>
      </div>
    </Router>
  );
}

export default App;

