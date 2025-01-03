import React, { useState } from 'react';

const DownloadComponent = () => {
  const [url, setUrl] = useState('');
  const [fileDetails, setFileDetails] = useState(null);

  const handleDownload = async () => {
    if (!url) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      const response = await window.electron.downloadFile(url);

      if (response.success) {
        setFileDetails(response.fileDetails); // Save file details
        console.log(response)
        alert('File downloaded successfully!');
      } else {
        alert(`Download failed: ${response.error}`);
      }
    } catch (error) {
      alert(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Download File</h2>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <br />
      <button
        onClick={handleDownload}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Download
      </button>

      {fileDetails && (
        <div style={{ marginTop: '20px', textAlign: 'left', display: 'inline-block' }}>
          <h3>File Details</h3>
          <p><strong>File Name:</strong> {fileDetails.fileName}</p>
          <p><strong>File Path:</strong> {fileDetails.filePath}</p>
          <p><strong>File Size:</strong> {(fileDetails.fileSize / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
};

export default DownloadComponent;
