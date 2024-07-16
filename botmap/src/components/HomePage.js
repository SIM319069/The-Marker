import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";
const BASE_URL = 'https://api.teamup.com/ksg7y4nwkfp7q6xyio';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    cpe: false,
    mcpe: false,
    isne: false,
    RoomReservation: false,
    Xternalmcpe: false,
    XternalUndergrad: false,
  });

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

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = event => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  const filterEvents = event => {
    let include = true;
    if (filters.cpe && !event.title.includes('cpe')) include = false;
    if (filters.mcpe && !event.title.includes('mcpe')) include = false;
    if (filters.isne && !event.title.includes('isne')) include = false;
    if (filters.RoomReservation && !event.title.includes('Room reservation')) include = false;
    if (filters.Xternalmcpe && !event.title.includes('xternal mcpe')) include = false;
    if (filters.XternalUndergrad && !event.title.includes('xternal Undergrad')) include = false;
    return include;
  };

  const filteredEvents = events
    .filter(event => filterEvents(event))
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.notes && event.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.who && event.who.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (new Date(event.start_dt).toLocaleDateString().includes(searchTerm)) ||
      (new Date(event.start_dt).toLocaleTimeString().includes(searchTerm)) ||
      (new Date(event.end_dt).toLocaleTimeString().includes(searchTerm))
    );

  return (
    <div className="HomePage">
      <main>
        <h1>Teamup Events</h1>
        <input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="filters">
          <h3>Filters:</h3>
          {Object.keys(filters).map(filter => (
            <label key={filter}>
              <input
                type="checkbox"
                name={filter}
                checked={filters[filter]}
                onChange={handleFilterChange}
              />
              {filter}
            </label>
          ))}
        </div>
        <ul>
          {filteredEvents.map(event => (
            <li key={event.id} className="event-item">
              <h2>{event.title}</h2>
              <p><strong>Date:</strong> {new Date(event.start_dt).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(event.start_dt).toLocaleTimeString()} - {new Date(event.end_dt).toLocaleTimeString()}</p>
              <p><strong>Location:</strong> {event.location || 'No location specified'}</p>
              <p><strong>Professor:</strong> {event.who || 'No professor specified'}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default HomePage;
