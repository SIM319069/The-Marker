import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import the Chart.js library
import '../css/Events.css';  // Import the CSS file

const API_KEY = "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";
const BASE_URL = 'https://api.teamup.com/ksg7y4nwkfp7q6xyio';

function Events() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    cpe: false,
    mcpe: false,
    isne: false,
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
    const title = event.title;
    if (filters.cpe && !title.includes('cpe')) include = false;
    if (filters.mcpe && !title.includes('mcpe')) include = false;
    if (filters.isne && !title.includes('isne')) include = false;
    if (filters.Xternalmcpe && !title.includes('xternal mcpe')) include = false;
    if (filters.XternalUndergrad && !title.includes('xternal undergrad')) include = false;
    return include;
  };

  const filteredEvents = events
    .filter(event => filterEvents(event))
    .filter(event => 
      event.title.includes(searchTerm) ||
      (event.notes && event.notes.includes(searchTerm)) ||
      (event.location && event.location.includes(searchTerm)) ||
      (event.who && event.who.includes(searchTerm)) ||
      (new Date(event.start_dt).toLocaleDateString().includes(searchTerm)) ||
      (new Date(event.start_dt).toLocaleTimeString().includes(searchTerm)) ||
      (new Date(event.end_dt).toLocaleTimeString().includes(searchTerm))
    );

  const totalFilteredEventsCount = filteredEvents.length;
  const totalEventCount = events.length; // all event that we have

  const cpeCount = events.filter(event => event.title.includes('cpe')).length;
  const mcpeCount = events.filter(event => event.title.includes('mcpe')).length;
  const isneCount = events.filter(event => event.title.includes('isne')).length;
  const xternalmcpeCount = events.filter(event => event.title.includes('xternal mcpe')).length;
  const xternalUndergradCount = events.filter(event => event.title.includes('xternal undergrad')).length;

  const chartData = {
    labels: ['CPE', 'MCPE', 'ISNE', 'Xternal MCPE', 'Xternal Undergrad'],
    datasets: [
      {
        label: 'Event Count',
        data: [cpeCount, mcpeCount, isneCount, xternalmcpeCount, xternalUndergradCount],
        backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#9966ff'],
      }
    ]
  };

  return (
    <div className="flex m-0 font-sans bg-eventbackgroundcolor">
      <main className='flex-1 p-0 ml-[150px] rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.1)]'>
        <h1 className='text-center mb-[20px]'>Teamup Events</h1>
        <div className="data-display">
          <h3>Total Events: {totalEventCount}</h3>
          <h3>Total Filtered Events: {totalFilteredEventsCount}</h3>
          <div className="chart-container"><Bar data={chartData} /></div>
        </div>
        <input
          type="text"
          className="w-full p-2.5 mb-5 border border-gray-300 rounded-sm" 
          placeholder="Search events"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="mb-[20px] ml-[25px]">
          <h3 className='mb-[10px]'>Filters:</h3>
          {Object.keys(filters).map(filter => (
            <label className='block mb-[10px]' key={filter}>
              <input
                type="checkbox"
                className='mr-[10px]'
                name={filter}
                checked={filters[filter]}
                onChange={handleFilterChange}
              />
              {filter}
            </label>
          ))}
        </div>
        <ul className='list-none p-0'>
          {filteredEvents.map(event => (
            <li key={event.id} className="bg-gray-100 p-[15px] mb-[10px] ml-[25px] rounded-sm shadow-[0_0_5px_rgba(0,0,0,0.1)]">
              <h2 className='mb-[10px]'>{event.title}</h2>
              <p className='my-[5px]'><strong>Date:</strong> {new Date(event.start_dt).toLocaleDateString()}</p>
              <p className='my-[5px]'><strong>Time:</strong> {new Date(event.start_dt).toLocaleTimeString()} - {new Date(event.end_dt).toLocaleTimeString()}</p>
              <p className='my-[5px]'><strong>Location:</strong> {event.location || 'No location specified'}</p>
              <p className='my-[5px]'><strong>Professor:</strong> {event.who || 'No professor specified'}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default Events;
