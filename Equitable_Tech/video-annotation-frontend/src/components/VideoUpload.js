import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Fetch the logged-in user's details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/', {
          headers: {
            'Authorization': `Token ${Cookies.get('token')}`
          },
        }); // Assuming an endpoint to get current user
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadError('Please select a video file.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadError('File size exceeds 100MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/video/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${Cookies.get('token')}`
        },
      });
      console.log('Video uploaded successfully');
      setUploadError('');
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadError('Failed to upload the video.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Video</h2>
      <p>Welcome, {username}!</p> {/* Display username */}
      <form onSubmit={handleUpload} style={styles.form}>
        <input type="file" accept="video/mp4,video/avi" onChange={handleFileChange} style={styles.input} />
        {uploadError && <p style={styles.error}>{uploadError}</p>}
        <button type="submit" style={styles.button}>Upload</button>
      </form>
      <button style={styles.backButton} onClick={() => navigate('/')}>
        Back
      </button>
      <button style={styles.viewButton} onClick={() => navigate('/my-videos')}>
        View Uploaded Videos
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    margin: '10px',
    width: '300px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#ccc',
  },
  viewButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  error: {
    color: 'red',
  },
};

export default Upload;
