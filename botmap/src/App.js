import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const API_KEY = "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";
const BASE_URL = 'https://api.teamup.com/ksg7y4nwkfp7q6xyio';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/events`, {
      headers: {
        'Teamup-Token': API_KEY,
      }
    })
    .then(response => {
      setEvents(response.data.events);
      console.log('Fetched data: ', response.data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn BOTMAPS
        </a>
      </header>
      <main>
        <h1>Teamup Events</h1>
        <ul>
          {events.map(event => (
            <li key={event.id} className="event-item">
              <h2>{event.title}</h2>
              <p><strong>Date:</strong> {new Date(event.startTime).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}</p>
              <p><strong>Description:</strong> {event.description || 'No description available'}</p>
              <p><strong>Location:</strong> {event.location || 'No location specified'}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
