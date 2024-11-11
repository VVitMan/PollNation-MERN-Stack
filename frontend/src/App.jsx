import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Poll from './Poll/Poll.jsx'

import { BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import ProfilePage from './scenes/profilePage';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from './theme';

function App() {
  // const [count, setCount] = useState(0)
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return ( <div className='app'>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/profile/:userId' element={<ProfilePage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </div>
  )
}

export default App





/* 
<>
  <Poll />
</> 
*/

/* vit
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<Home />} />
    <Route path="/questions" element={<Questions />} />
  </Routes>
</BrowserRouter> */

/*
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