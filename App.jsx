// src/App.jsx (or App.js)
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import './App.css';

function App() {
  // useState hook to store the message from the backend
  const [backendMessage, setBackendMessage] = useState('');

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetch('http://localhost:3001/api/test-message') // URL of your backend endpoint
      .then(response => {
        // Check if the HTTP response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON data from the response
      })
      .then(data => {
        // Set the backend message in our state
        setBackendMessage(data.message);
      })
      .catch(error => {
        // Log any errors to the console and update the message
        console.error("Could not fetch data from backend:", error);
        setBackendMessage("Failed to load message from backend.");
      });
  }, []); // The empty array [] means this effect runs only once when the component mounts

  return (
    <div> {/* You might want a general wrapper div */}
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Telecypher Game</h1>
        <p>Message from Backend: <strong>{backendMessage}</strong></p>
      </header>

      <div className="game-scene">
        {/* This is where our game elements will go */}
        {/* We'll add the character here next */}
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
          (Game scene content will appear here soon)
        </p>
      </div>
    </div>
  );
}

export default App;