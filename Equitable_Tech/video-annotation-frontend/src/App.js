// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import VideoUpload from './components/VideoUpload';
import MyVideos from './components/MyVideos';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/my-videos" element={<MyVideos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
