import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Fetch the logged-in user's details and their videos
  useEffect(() => {
    const fetchUserAndVideos = async () => {
      try {
        // Fetch the username
        const userResponse = await axios.get('/api/accounts/user/');
        setUsername(userResponse.data.username);

        // Fetch the videos
        const videosResponse = await axios.get('/api/videos/my-videos/');
        setVideos(videosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserAndVideos();
  }, []);

  return (
    <div style={styles.container}>
      <h2>My Uploaded Videos</h2>
      <p>Welcome, {username}!</p> {/* Display username */}
      <p>You have uploaded {videos.length} videos.</p> {/* Display video count */}
      <ul style={styles.videoList}>
        {videos.map((video) => (
          <li key={video.id} style={styles.videoItem}>
            {video.title} ({video.duration} seconds)
          </li>
        ))}
      </ul>
      <button style={styles.backButton} onClick={() => navigate('/')}>
        Back
      </button>
      <button style={styles.uploadButton} onClick={() => navigate('/upload')}>
        Upload More Videos
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  videoList: {
    listStyleType: 'none',
    padding: 0,
  },
  videoItem: {
    margin: '10px 0',
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#ccc',
  },
  uploadButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
};

export default MyVideos;
