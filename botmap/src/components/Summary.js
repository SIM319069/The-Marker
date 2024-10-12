import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import StatisticBox from "./StatisticBox";
import useFetchEvents from "../api/teamup";
import moment from "moment";
import { google, outlook, office365, yahoo, ics, CalendarEvent } from "calendar-link";
import { useEffect } from "react";

function Summary() {
  const [selectedCategory, setSelectedCategory] = useState("roomChart");
  const [mode, setMode] = useState("today");
  const events = useFetchEvents();
  const [filters, setFilters] = useState({
    cpe: false,
    mcpe: false,
    isne: false,
    RoomReservation: false,
    XternalGrad: false,
    XternalUndergrad: false,
    ปฏิทินการศึกษา: false,
  });

  const filterValues = {
    cpe: 3454069,
    mcpe: 3454071,
    isne: 3454070,
    RoomReservation: 6820246,
    XternalGrad: 8208439,
    XternalUndergrad: 3454093,
    ปฏิทินการศึกษา: 6616868,
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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

    // console.log(startTime, endTime);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(`Location: ${event.location || "No location specified"}\nProfessor: ${event.who || "No professor specified"}`)}&location=${encodeURIComponent(event.location || "No location specified")}&ctz=${encodeURIComponent(timeZone)}`;
  
    window.location.href = googleCalendarUrl;
  };
  

  const getDatesForMode = (mode) => {
    const today = moment().startOf('day');
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    switch (mode) {
      case "today":
        return { start: today, end: today.clone().endOf('day') };
      case "week":
        return { start: startOfWeek, end: endOfWeek };
      case "month":
        return { start: startOfMonth, end: endOfMonth };
      default:
        return { start: null, end: null };
    }
  };

  const { start, end } = getDatesForMode(mode);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  const filterEvents = (event) => {
    const activeFilters = Object.keys(filters).filter(
      (filter) => filters[filter]
    );
    if (activeFilters.length === 0) return true;

    return activeFilters.some((filter) =>
      event.subcalendar_ids.includes(filterValues[filter])
    );
  };

  // Filter events based on mode, filters, and search term
  const filteredEvents = events.filter((event) => {
    const eventDate = moment(event.start_dt);
    const matchesSearch = searchTerm
      ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.notes && event.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.who && event.who.toLowerCase().includes(searchTerm.toLowerCase())) ||
        new Date(event.start_dt).toLocaleDateString().includes(searchTerm) ||
        new Date(event.start_dt).toLocaleTimeString().includes(searchTerm) ||
        new Date(event.end_dt).toLocaleTimeString().includes(searchTerm)
      : true;

    return (
      matchesSearch &&
      (!start || !end || (eventDate.isBetween(start, end, null, '[]') && filterEvents(event)))
    );
  });
  const roomUsage = filteredEvents.reduce((acc, event) => {
    const room = event.location || "No location specified";
    const title = event.title.toLowerCase();
    const major = title.includes("cpe")
      ? "CPE"
      : title.includes("mcpe")
        ? "MCPE"
        : title.includes("isne")
          ? "ISNE"
          : "OTHER";

    if (room !== "No location specified" && !room.includes("xxx")) {
      if (!acc[room]) {
        acc[room] = {
          total: 0,
          majors: { CPE: 0, MCPE: 0, ISNE: 0, OTHER: 0 },
        };
      }
      acc[room].total++;
      acc[room].majors[major]++;
    }
    return acc;
  }, {});

  const sortedRooms = Object.entries(roomUsage).sort(
    (a, b) => b[1].total - a[1].total
  );

  const chartData = {
    labels: sortedRooms.map(([room]) => room),
    datasets: [
      {
        label: "Room Usage",
        data: sortedRooms.map(([, usage]) => usage.total),
        backgroundColor: sortedRooms.map(
          (_, index) => `hsl(${index * 30}, 70%, 50%)`
        ),
      },
    ],
  };

  // Calculate room usage frequency from Monday to Friday
  const roomUsageByDay = filteredEvents.reduce((acc, event) => {
    const eventDay = moment(event.start_dt).format('dddd'); // Get the day of the week, e.g., "Monday"
    const room = event.location || "No location specified";

    if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(eventDay)) {
      if (!acc[room]) acc[room] = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 };
      acc[room][eventDay] += 1;
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
    return acc;
  }, {});

  // Updated frequencyChartData to reflect filtered and searched events
  const cpeCount = filteredEvents.filter((event) =>
    event.title.toLowerCase().includes("cpe")
  ).length;
  const mcpeCount = filteredEvents.filter((event) =>
    event.title.toLowerCase().includes("mcpe")
  ).length;
  const isneCount = filteredEvents.filter((event) =>
    event.title.toLowerCase().includes("isne")
  ).length;

  const majorchartData = {
    labels: ["ISNE", "CPE", "MCPE"],
    datasets: [
      {
        label: "Event Count",
        data: [isneCount, cpeCount, mcpeCount],
        backgroundColor: ["#36a2eb", "#ff9f40", "#4bc0c0"],
      },
    ],
  };
  const frequencyChartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Total Room Usage Frequency",
        data: [
          totalRoomUsageByDay.Monday || 0,
          totalRoomUsageByDay.Tuesday || 0,
          totalRoomUsageByDay.Wednesday || 0,
          totalRoomUsageByDay.Thursday || 0,
          totalRoomUsageByDay.Friday || 0,
        ],
        backgroundColor: ["#a88d32", "#a83285", "#32a834", "#a85932", "#326ba8"],
      },
    ],
  };
  const totalEventCount = filteredEvents.length;

  const totalRoomsUsed = Object.keys(roomUsage).length;
  const totalDuration = filteredEvents.reduce(
    (acc, event) => acc + (new Date(event.end_dt) - new Date(event.start_dt)),
    0
  );
  const averageEventDuration = (
    totalDuration /
    totalEventCount /
    1000 /
    60
  ).toFixed(2);

  const peakUsageHours = filteredEvents.reduce((acc, event) => {
    const startHour = new Date(event.start_dt).getHours();
    if (!acc[startHour]) {
      acc[startHour] = 0;
    }
    acc[startHour]++;
    return acc;
  }, {});

  const sortedPeakHours = Object.entries(peakUsageHours).sort(
    (a, b) => b[1] - a[1]
  );
  const topHour =
    sortedPeakHours.length > 0 ? parseInt(sortedPeakHours[0][0]) : null;
  const peakHourFormatted =
    topHour !== null
      ? `${topHour.toString().padStart(2, "0")}:00 - ${(topHour + 1) % 24}:00`
      : "N/A";

  const filteredEventsMorons = events
    .filter((event) => filterEvents(event))
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.notes &&
          event.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location &&
          event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.who &&
          event.who.toLowerCase().includes(searchTerm.toLowerCase())) ||
        new Date(event.start_dt).toLocaleDateString().includes(searchTerm) ||
        new Date(event.start_dt).toLocaleTimeString().includes(searchTerm) ||
        new Date(event.end_dt).toLocaleTimeString().includes(searchTerm)
    );

  return (
    <div className="ml-10">
      <main className="flex flex-col bg-cover pl-40 p-4 bg-[#e2e2eb]">
        <h1 className="mb-5 font-serif text-4xl font-bold">
          Room Usage Summary
        </h1>
        <div className="flex bg-gray-400 mb-5 w-full h-12"></div>
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Other components */}
          <StatisticBox
            title="Total Event"
            value={totalEventCount}
            percentage={null}
          />
          <div className="flex items-center ml-6">
            <label htmlFor="modeSwitch" className="mr-2 text-xl font-medium">
              Mode:
            </label>
            <div className="relative">
              <input
                id="modeSwitch"
                type="checkbox"
                checked={mode === "today"}
                onChange={() => {
                  setMode(mode === "today" ? "week" : mode === "week" ? "month" : "today");
                }}
                className="sr-only"
              />
              <div
                onClick={() => {
                  setMode(mode === "today" ? "week" : mode === "week" ? "month" : "today");
                }}
                className="w-24 h-8 bg-gray-300 rounded-full cursor-pointer relative flex items-center"
              >
                <div
                  className={`w-8 h-8 bg-blue-600 rounded-full shadow-md absolute transition-transform duration-300 ${mode === "today" ? "translate-x-0" : mode === "week" ? "translate-x-8" : "translate-x-16"
                    }`}
                ></div>
              </div>
            </div>
            <span className="ml-2">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
          </div>
        </div>

        

        {/* Frequency of Week Chart */}        <div className="gap-32 py-5 flex h-[540px]">
          <div className="w-full max-w-[800px] bg-gray-100 rounded-lg border border-gray-300">
                {/* Category Navigation */}
            <nav className="my-5 justify-center flex">
              <button
                onClick={() => setSelectedCategory("roomChart")}
                className={`mr-3 px-3 py-2 rounded-md ${
                  selectedCategory === "roomChart"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Room Usage Chart
              </button>          <button
                onClick={() => setSelectedCategory("majorChart")}
                className={`mr-3 px-3 py-2 rounded-md ${selectedCategory === "majorChart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
              >
                Event Count
              </button>
              <button
                onClick={() => setSelectedCategory("frequencyChart")}
                className={`mr-3 px-3 py-2 rounded-md ${
                  selectedCategory === "frequencyChart"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Frequency of Week
              </button>          <button
                onClick={() => setSelectedCategory("statistic")}
                className={`mr-3 px-3 py-2 rounded-md ${selectedCategory === "statistic"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
              >
                Statistic
              </button>
            </nav>
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
            {/* Search and Filter UI */}          {/* {selectedCategory === "doughnutChart" && (
                <div className="w-[800px] h-[500px]">
                  <Doughnut data={doughnutData} />
                </div>
              )} */}
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
        <div className="ml-0 w-[500px] bg-gray-100 border border-gray-300 rounded-t-lg shadow-sm overflow-hidden">
          <input
              type="text"
              className="w-full h-[50px] p-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ease-in-out"
              placeholder="Search events"
              value={searchTerm}
              onChange={handleSearch}
          />
          <div class="h-[450px] overflow-y-scroll overflow-x-hidden">
            
            {/* Events list */}            <ul className="list-none p-0 w-full max-w-xl">
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
