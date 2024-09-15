import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Fetch the logged-in user's details and their videos
  useEffect(() => {
    const fetchUserAndVideos = async () => {
      try {
        // Fetch the username
        const userResponse = await axios.get('http://localhost:8000/user/', {
            headers: {
                'Authorization': `Token ${Cookies.get('token')}`
            }
        });
        setUsername(userResponse.data.username);

        // let videos = [];
        // for (let i = 0; i < userResponse.data.files.length; i++) {
        //     const video = await axios.get(`http://localhost:8000/video/${userResponse.data.files[i]}/`, {
        //         headers: {
        //             'Authorization': `Token ${Cookies.get('token')}`
        //         }
        //     });
        //     videos.push(video.data);
        // }

        setVideos(userResponse.data.files);
        // Fetch the videos
        // const videosResponse = await axios.get('/videos/my-videos/');
        // setVideos(videos);
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
          <li key={video} style={styles.videoItem}>
                {video}
                {/* <video width="320" height="240">
                    <source src={`video/${video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video> */}
                <button onClick={() => navigate(`/annotations/${video}`)}>Edit</button>
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
