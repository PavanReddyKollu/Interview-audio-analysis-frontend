import React, { useState } from 'react';
import { Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';
import Loader from './Loader';

function AudioUpload({loading,result}) {
  const [audioFile, setAudioFile] = useState(null);
  // const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    } else {
      alert('Please upload a valid audio file.');
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      alert('No audio file selected!');
      return;
    }
    loading(true);
    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      if(response.data.length > 0) {
        result(response.data)
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    } finally {
      loading(false);
    }
  };

  // if (loading) return <Loader />;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    }}>
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadIcon />}
        className="upload-audio-btn"
      >
        Choose Audio
        <input
          type="file"
          accept="audio/*"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={!audioFile}
        className="upload-btn"
      >
        Upload
      </Button>
    </div>
  );
}

export default AudioUpload;
