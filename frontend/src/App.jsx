import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx';
import Poll from './Poll/Poll.jsx';
import ProfilePage from './ProfilePage/ProfilePage.jsx'; // Import the ProfilePage component
import EditProfile from './EditProfile/EditProfile.jsx';
import CreateEditPoll from './CreateEditPoll/CreateEditPoll.jsx';

function App() {
  return (
    <Router>
      <div className="main-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Poll />} /> {/* Main Poll Page */}
        <Route path="/profile/:username" element={<ProfilePage />} /> {/* Profile Page */}
        <Route path='/edit-profile' element={<EditProfile />}></Route> {/* Edit Profile Page */}
        <Route path="/edit-poll/:pollId" element={<CreateEditPoll />} /> {/* Edit/Create Poll Page */}
      </Routes>
      </div>
    </Router>
  );
}

export default App;


/*
        <Route path="/edit-profile" element={<EditProfile />} />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        Test Hello World!
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
*/