import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // Import the Chart.js library
import '../css/Summary.css';  // Import the CSS file

const API_KEY = "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";
const BASE_URL = 'https://api.teamup.com/ksg7y4nwkfp7q6xyio';

function Summary() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/events`, {
      headers: {
        'Teamup-Token': API_KEY,
      }
    })
    .then(response => {
      setEvents(response.data.events);
      console.log('Fetched data: ', response.data.events); // Log the fetched events
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);

  const roomUsage = events.reduce((acc, event) => {
    const room = event.location || 'No location specified';
    const title = event.title.toLowerCase();
    console.log('Event title:', title); // Log each event title
    const major = title.includes('cpe') ? 'CPE' :
                  (title.includes('grad') && title.includes('xternal')) ? 'Xternal > Grad' :
                  (title.includes('undergrad') && title.includes('xternal')) ? 'Xternal > Undergrad' :
                  title.includes('grad') ? 'Grad' :
                  title.includes('isne') ? 'ISNE' : 'OTHER';
    
    if (!acc[room]) {
      acc[room] = { total: 0, majors: { CPE: 0, 'Grad': 0, 'ISNE': 0, 'Xternal > Undergrad': 0, 'Xternal > Grad': 0, 'OTHER': 0 } };
    }
    acc[room].total++;
    acc[room].majors[major]++;
    return acc;
  }, {});

  const sortedRooms = Object.entries(roomUsage).sort((a, b) => b[1].total - a[1].total);

  const chartData = {
    labels: sortedRooms.map(([room]) => room),
    datasets: [
      {
        label: 'Room Usage',
        data: sortedRooms.map(([, usage]) => usage.total),
        backgroundColor: sortedRooms.map((_, index) => `hsl(${index * 30}, 70%, 50%)`), // Generate colors
      }
    ]
  };

  const majorUsage = sortedRooms.reduce((acc, [room, usage]) => {
    Object.keys(usage.majors).forEach(major => {
      if (!acc[major]) {
        acc[major] = 0;
      }
      acc[major] += usage.majors[major];
    });
    return acc;
  }, { CPE: 0, 'Grad': 0, 'ISNE': 0, 'Xternal > Undergrad': 0, 'Xternal > Grad': 0, 'OTHER': 0 });

  const doughnutData = {
    labels: ['ISNE', 'CPE', 'Xternal > Undergrad', 'Xternal > Grad', 'Grad'],
    datasets: [
      {
        label: 'Major Usage',
        data: [majorUsage.ISNE, majorUsage.CPE, majorUsage['Xternal > Undergrad'], majorUsage['Xternal > Grad'], majorUsage.Grad],
        backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#f0a500'], // Colors for each major
      }
    ]
  };

  return (
    <div className="flex m-0 font-sans bg-summarybackgroundcolor">
      <main className='flex-1 p-0 ml-[150px] rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.1)]'>
        <h1 className='text-center mb-[20px]'>Room Usage Summary</h1>
        <div className="chart-section">
          <div className="chart-container">
            <Bar data={chartData} options={{ indexAxis: 'y' }} /> {/* Horizontal Bar Chart */}
          </div>
          <div className="chart-container">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Summary;
