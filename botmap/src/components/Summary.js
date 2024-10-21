import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js components
import StatisticBox from "./StatisticBox"; // Import custom StatisticBox component
import useFetchEvents from "../api/teamup"; // Custom hook to fetch events
import moment from "moment"; // Import moment.js for date handling
import { google, outlook, office365, yahoo, ics, CalendarEvent } from "calendar-link"; // Import calendar link generation utilities
import { useEffect } from "react"; // React Hook for side effects

function Summary() {
  const [selectedCategory, setSelectedCategory] = useState("roomChart"); // State to manage selected chart category
  const [mode, setMode] = useState("today"); // State to manage selected mode (today, week, month)
  const events = useFetchEvents(); // Fetch events from API using custom hook
  const [filters, setFilters] = useState({
    cpe: false,
    mcpe: false,
    isne: false,
    RoomReservation: false,
    XternalGrad: false,
    XternalUndergrad: false,
    ปฏิทินการศึกษา: false,  // State to manage selected filters
  });

  const filterValues = {
    cpe: 3454069,
    mcpe: 3454071,
    isne: 3454070,
    RoomReservation: 6820246,
    XternalGrad: 8208439,
    XternalUndergrad: 3454093,
    ปฏิทินการศึกษา: 6616868, // Mapping filter names to IDs for filtering events
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update search term when user types
  };

  const handleEventClick = (event) => {
    const timeZone = "Asia/Bangkok"; // Timezone for the event

    // Create Date objects for start and end times
    const startDate = new Date(event.start_dt);
    const endDate = new Date(event.end_dt);

    startDate.setHours(startDate.getHours() + 7);
    endDate.setHours(endDate.getHours() + 7);

    // Construct the start and end times in the format required by Google Calendar
    const startTime = startDate.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15); // Format: YYYYMMDDTHHMMSS
    const endTime = endDate.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15); // Format: YYYYMMDDTHHMMSS

    // Generate Google Calendar link

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(`Location: ${event.location || "No location specified"}\nProfessor: ${event.who || "No professor specified"}`)}&location=${encodeURIComponent(event.location || "No location specified")}&ctz=${encodeURIComponent(timeZone)}`;

    window.location.href = googleCalendarUrl; // Redirect to Google Calendar link
  };


  const getDatesForMode = (mode) => {
    const today = moment().startOf('day'); // Get current day start
    const startOfWeek = moment().startOf('week'); // Start of the week
    const endOfWeek = moment().endOf('week'); // End of the week
    const startOfMonth = moment().startOf('month'); // Start of the month
    const endOfMonth = moment().endOf('month'); // End of the month

    switch (mode) {
      case "today":
        return { start: today, end: today.clone().endOf('day') }; // Return today's date range
      case "week":
        return { start: startOfWeek, end: endOfWeek }; // Return week date range
      case "month":
        return { start: startOfMonth, end: endOfMonth }; // Return month date range
      default:
        return { start: null, end: null }; // Default case
    }
  };

  const { start, end } = getDatesForMode(mode); // Get date range for selected mode

  // Handle filter toggle to update the state for selected filters
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked, // Update filters based on user selection
    });
  };

// Function to check if an event matches active filters
const filterEvents = (event) => {
  const activeFilters = Object.keys(filters).filter(
    (filter) => filters[filter]
  );
  if (activeFilters.length === 0) return true; // If no filters are active, return all events

  return activeFilters.some((filter) =>
    event.subcalendar_ids.includes(filterValues[filter]) // Check if event matches any active filter
  );
};

  // Filter events based on selected mode, filters, and search term
  const filteredEvents = events.filter((event) => {
    const eventDate = moment(event.start_dt); // Convert event start time to Moment object
    const matchesSearch = searchTerm
      ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.notes && event.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.who && event.who.toLowerCase().includes(searchTerm.toLowerCase())) ||
      new Date(event.start_dt).toLocaleDateString().includes(searchTerm) ||
      new Date(event.start_dt).toLocaleTimeString().includes(searchTerm) ||
      new Date(event.end_dt).toLocaleTimeString().includes(searchTerm)
      : true; // Check if search term matches any event fields

      return (
        matchesSearch &&
        (!start || !end || (eventDate.isBetween(start, end, null, '[]') && filterEvents(event))) // Filter by date range and active filters
      );
    });
  
    // Calculate room usage statistics
    const roomUsage = filteredEvents.reduce((acc, event) => {
      const room = event.location || "No location specified"; // Get room name or default to "No location specified"
      const title = event.title.toLowerCase(); // Get event title in lowercase
      const major = title.includes("cpe")
        ? "CPE"
        : title.includes("mcpe")
          ? "MCPE"
          : title.includes("isne")
            ? "ISNE"
            : "OTHER"; // Determine major based on event title

            if (room !== "No location specified" && !room.includes("xxx")) {
              if (!acc[room]) {
                acc[room] = {
                  total: 0,
                  majors: { CPE: 0, MCPE: 0, ISNE: 0, OTHER: 0 }, // Initialize room usage object
                };
              }
              acc[room].total++; // Increment total room usage count
              acc[room].majors[major]++; // Increment major-specific usage count
            }
            return acc;
          }, {});

          const sortedRooms = Object.entries(roomUsage).sort(
            (a, b) => b[1].total - a[1].total // Sort rooms by total usage in descending order
          );

  // Prepare chart data for room usage
  const chartData = {
    labels: sortedRooms.map(([room]) => room), // Use room names as labels
    datasets: [
      {
        label: "Room Usage",
        data: sortedRooms.map(([, usage]) => usage.total), // Use total usage as data points
        backgroundColor: sortedRooms.map(
          (_, index) => `hsl(${index * 30}, 70%, 50%)` // Generate colors for each room
        ),
      },
    ],
  };

  // Calculate room usage frequency by day of the week (Monday to Friday)
  const roomUsageByDay = filteredEvents.reduce((acc, event) => {
    const eventDay = moment(event.start_dt).format('dddd'); // Get the day of the week for the event
    const room = event.location || "No location specified"; // Get room name or default to "No location specified"

    if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(eventDay)) {
      if (!acc[room]) acc[room] = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 }; // Initialize object for the room
      acc[room][eventDay] += 1; // Increment usage count for the specific day
    }

    return acc;
  }, {});

  // Calculate room usage frequency from Monday to Friday for filtered events
  const totalRoomUsageByDay = filteredEvents.reduce((acc, event) => {
    const eventDay = moment(event.start_dt).format("dddd"); // Get the day of the week, e.g., "Monday"
    if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(eventDay)) {
      if (!acc[eventDay]) acc[eventDay] = 0; // Initialize if not present
      acc[eventDay] += 1; // Increment count for the day
    }
    return acc; // Return the updated accumulator object with room usage count for each day
  }, {});

  // Filter events by major category (CPE, MCPE, ISNE) and count them
const cpeCount = filteredEvents.filter((event) =>
  event.title.toLowerCase().includes("cpe")
).length;
const mcpeCount = filteredEvents.filter((event) =>
  event.title.toLowerCase().includes("mcpe")
).length;
const isneCount = filteredEvents.filter((event) =>
  event.title.toLowerCase().includes("isne")
).length;

// Data for Major Event Count Chart
const majorchartData = {
  labels: ["ISNE", "CPE", "MCPE"], // Major labels
  datasets: [
    {
      label: "Event Count", // Chart label
      data: [isneCount, cpeCount, mcpeCount], // Event count data for each major
      backgroundColor: ["#36a2eb", "#ff9f40", "#4bc0c0"], // Colors for each major
    },
  ],
};
  // Data for Room Usage Frequency Chart (Monday to Friday)
const frequencyChartData = {
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // Days of the week
  datasets: [
    {
      label: "Total Room Usage Frequency", // Chart label
      data: [
        totalRoomUsageByDay.Monday || 0, // Total room usage on Monday (0 if no data)
        totalRoomUsageByDay.Tuesday || 0,
        totalRoomUsageByDay.Wednesday || 0,
        totalRoomUsageByDay.Thursday || 0,
        totalRoomUsageByDay.Friday || 0,
      ],
      backgroundColor: ["#a88d32", "#a83285", "#32a834", "#a85932", "#326ba8"], // Colors for each day
    },
  ],
};
  // Total number of filtered events
  const totalEventCount = filteredEvents.length;
  // Calculate total rooms used by checking the roomUsage object
  const totalRoomsUsed = Object.keys(roomUsage).length;
  // Calculate total event duration
  const totalDuration = filteredEvents.reduce(
    (acc, event) => acc + (new Date(event.end_dt) - new Date(event.start_dt)),
    0
  );
  // Calculate the average event duration in minutes and round to 2 decimal places
  const averageEventDuration = (
    totalDuration /
    totalEventCount /
    1000 /
    60
  ).toFixed(2);

  // Determine the peak usage hour by counting the number of events that start in each hour
  const peakUsageHours = filteredEvents.reduce((acc, event) => {
    const startHour = new Date(event.start_dt).getHours(); // Get the starting hour of the event
    if (!acc[startHour]) {
      acc[startHour] = 0; // Initialize count if not already present
    }
    acc[startHour]++; // Increment count for the hour
    return acc;
  }, {});

// Sort the peak usage hours to find the hour with the highest event count
const sortedPeakHours = Object.entries(peakUsageHours).sort(
  (a, b) => b[1] - a[1]
);

// Get the top usage hour, or null if no events are found
const topHour = 
  sortedPeakHours.length > 0 ? parseInt(sortedPeakHours[0][0]) : null;

// Format the peak usage hour for display, converting to "HH:00 - HH+1:00"
const peakHourFormatted =
  topHour !== null
    ? `${topHour.toString().padStart(2, "0")}:00 - ${(topHour + 1) % 24}:00`
    : "N/A"; // If no peak hour found, return "N/A"

  // Filter events based on selected filters and search term, including searches in title, notes, location, and professor 
const filteredEventsMorons = events
.filter((event) => filterEvents(event)) // Apply custom filter logic
.filter(
  (event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by event title
    (event.notes &&
      event.notes.toLowerCase().includes(searchTerm.toLowerCase())) || // Search by event notes
    (event.location &&
      event.location.toLowerCase().includes(searchTerm.toLowerCase())) || // Search by event location
    (event.who &&
      event.who.toLowerCase().includes(searchTerm.toLowerCase())) || // Search by professor 
    new Date(event.start_dt).toLocaleDateString().includes(searchTerm) || // Search by event start date
    new Date(event.start_dt).toLocaleTimeString().includes(searchTerm) || // Search by event start time
    new Date(event.end_dt).toLocaleTimeString().includes(searchTerm) // Search by event end time
);
  return (
    <div>
      {/* Main container for the summary page */}
      <main className="flex flex-col bg-cover pl-40 p-4 bg-[#e2e2eb]">
        {/* Header for the room usage summary */}
        <h1 className="mb-5 font-serif text-4xl font-bold">
          Room Usage Summary
        </h1>
         {/* Horizontal separator */}
        <div className="flex bg-gray-400 mb-5 w-full h-12"></div>
          {/* Statistics and mode switch section */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <StatisticBox
            title="Total Event"
            value={totalEventCount}
            percentage={null}
          />
          {/* Mode switch for displaying data */}
          <div className="flex items-center ml-4">
            <label htmlFor="modeSwitch" className="mr-2 text-xl font-medium">
              Mode:
            </label>
            <div className="relative">
              {/* Hidden checkbox for mode selection */}
              <input
                id="modeSwitch"
                type="checkbox"
                checked={mode === "today"}
                onChange={() => {
                  setMode(mode === "today" ? "week" : mode === "week" ? "month" : "today");
                }}
                className="sr-only"
              />
              {/* Custom switch for mode selection */}
              <div
                onClick={() => {
                  setMode(mode === "today" ? "week" : mode === "week" ? "month" : "today");
                }}
                className="w-24 h-8 bg-gray-300 rounded-full cursor-pointer relative flex items-center"
              >
                 {/* Visual representation of the mode switch */}
                <div
                  className={`w-8 h-8 bg-blue-600 rounded-full shadow-md absolute transition-transform duration-300 ${mode === "today" ? "translate-x-0" : mode === "week" ? "translate-x-8" : "translate-x-16"
                    }`}
                ></div>
              </div>
            </div>
            {/* Display the current mode */}
            <span className="ml-2">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
          </div>
        </div>


          {/* Charts and statistics display area */}
        <div className="gap-32 py-5 flex h-[540px]">
          <div className="w-full max-w-[800px] bg-gray-100 rounded-lg border border-gray-300">
            {/* Category Navigation for selecting different charts */}
            <nav className="my-5 justify-center flex">
              {/* Button for Room Usage Chart */}
              <button
                onClick={() => setSelectedCategory("roomChart")}
                className={`mr-3 px-3 py-2 rounded-md ${selectedCategory === "roomChart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
              >
                Room Usage Chart
              </button> 
              {/* Button for Event Count Chart */}
              <button
                onClick={() => setSelectedCategory("majorChart")}
                className={`mr-3 px-3 py-2 rounded-md ${selectedCategory === "majorChart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
              >
                Event Count
              </button>
              {/* Button for Event Count Chart */}
              <button
                onClick={() => setSelectedCategory("frequencyChart")}
                className={`mr-3 px-3 py-2 rounded-md ${selectedCategory === "frequencyChart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
              >
                Frequency of Week
              </button>
              {/* Button for Frequency of Week Chart */}   
              <button
                onClick={() => setSelectedCategory("statistic")}
                className={`mr-3 px-3 py-2 rounded-md ${selectedCategory === "statistic"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
              >
                Statistic
              </button>
            </nav>
             {/* Render different charts based on selected category */}
            {selectedCategory === "majorChart" && (
              <div className="w-[800px] h-[500px]">
                <Bar data={majorchartData} />
              </div>
            )}
            {selectedCategory === "roomChart" && (
              <div className="w-[800px] h-[500px]">
                <Bar data={chartData} options={{ indexAxis: "y" }} />
              </div>
            )}
            {selectedCategory === "frequencyChart" && (
              <div className="w-[800px] h-[500px]">
                <Bar data={frequencyChartData} options={{ responsive: true }} />
              </div>
            )}
            {selectedCategory === "statistic" && (
              <div className="w-[800px] h-[160px]">
                <div className="p-5 bg-white rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">Statistics</h2>
                  <p>
                    <strong>Total Rooms Used:</strong> {totalRoomsUsed}
                  </p>
                  <p>
                    <strong>Average Event Duration:</strong>{" "}
                    {averageEventDuration} minutes
                  </p>
                  <p>
                    <strong>Peak Usage Hour:</strong> {peakHourFormatted}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Events list section */}
          <div className="w-[500px] bg-gray-100 border border-gray-300 rounded-t-lg shadow-sm overflow-hidden">
            <input
              type="text"
              className="w-full h-[50px] p-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ease-in-out"
              placeholder="Search events"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div class="h-[450px] overflow-y-scroll overflow-x-hidden">

              {/* Events list */}
              <ul className="list-none p-0 w-full max-w-xl">
                {filteredEventsMorons.map((event) => (
                  <li
                    key={event.id}
                    className="bg-gray-100 p-4 pr-12 border-y border-gray-300 shadow-sm flex justify-between items-center"
                  >
                    <div>
                    <h2 className="mb-[10px]">{event.title}</h2>
                    <p className="my-[5px]">
                      <strong>Date:</strong>{" "}
                      {new Date(event.start_dt).toLocaleDateString()}
                    </p>
                    <p className="my-[5px]">
                      <strong>Time:</strong>{" "}
                      {new Date(event.start_dt).toLocaleTimeString()} - {" "}
                      {new Date(event.end_dt).toLocaleTimeString()}
                    </p>
                    <p className="my-[5px]">
                      <strong>Location:</strong>{" "}
                      {event.location || "No location specified"}
                    </p>
                    <p className="my-[5px]">
                      <strong>Professor:</strong>{" "}
                      {event.who || "No professor specified"}
                    </p>
                  </div>
                  {/* Button for adding event to the user's calendar */}
                  <button
                    onClick={() => handleEventClick(event)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                  >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

          {/* Filter options for events */}
        <div className="justify-center w-[1000px] mx-auto mt-[20px] grid grid-cols-3 gap-4">
          {Object.keys(filters).map((filter) => (
            <label
              className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition gap-4"
              key={filter}
            >
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                name={filter}
                checked={filters[filter]}
                onChange={handleFilterChange}
              />
              <span>{filter}</span>
            </label>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Summary;
