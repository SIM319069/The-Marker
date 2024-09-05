import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import StatisticBox from "./StatisticBox";
import useFetchEvents from "../api/teamup";
import moment from "moment";

function Summary() {
  const [selectedCategory, setSelectedCategory] = useState("dayChart");
  const [mode, setMode] = useState("today");
  const events = useFetchEvents();
  const [filters, setFilters] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false, 
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
    let include = true;
    if (filters.monday && !event.title.toLowerCase().includes("monday"))
      include = false;
    if (filters.tuesday && !event.title.toLowerCase().includes("tuesday"))
      include = false;
    if (filters.wednesday && !event.title.toLowerCase().includes("wednesday"))
      include = false;
    if (filters.thursday && !event.title.toLowerCase().includes("thursday"))
      include = false;
    if (filters.friday && !event.title.toLowerCase().includes("friday"))
      include = false;
    if (filters.saturday && !event.title.toLowerCase().includes("saturday"))
      include = false;
    if (filters.sunday && !event.title.toLowerCase().includes("sunday"))
      include = false;
    return include;
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = moment(event.start_dt);
    return (!start || !end || (eventDate.isBetween(start, end, null, '[]') && filterEvents(event)));
  });

  const roomUsage = filteredEvents.reduce((acc, event) => {
    const room = event.location || "No location specified";
    const title = event.title.toLowerCase();
    const day = title.includes("monday")
      ? "monday"
      : title.includes("tuesday")
      ? "tuesday"
      : title.includes("wednesday")
      ? "wednesday"
      : title.includes("thursday")
      ? "thursday"
      : title.includes("friday")
      ? "friday"
      : title.includes("saturay")
      ? "saturday"
      : title.includes("sunday")
      ? "sunday"
      : "OTHER";

    if (room !== "No location specified" && !room.includes("xxx")) {
      if (!acc[room]) {
        acc[room] = {
          total: 0,
          days: { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 },
        };
      }
      acc[room].total++;
      acc[room].days[day]++;
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

  const dayUsage = Object.values(roomUsage).reduce(
    (acc, usage) => {
      Object.keys(usage.days).forEach((day) => {
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += usage.days[day];
      });
      return acc;
    },
    { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0, OTHER: 0 }
  );

  const doughnutData = {
    labels: ["monday",  "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    datasets: [
      {
        label: "day Usage",
        data: [
          dayUsage.monday,
          dayUsage.tuesday,
          dayUsage.wednesday,
          dayUsage.thursday,
          dayUsage.friday,
          dayUsage.saturday,
          dayUsage.sunday,
        ],
        backgroundColor: ["#deeb34", "#de008d", "#34eb71", "#34eb71", "#349ceb", "#df34eb", "#eb4934"],
      },
    ],
  };
  const mondayCount = filteredEvents.filter((event) => 
    event.title.toLowerCase().includes("monday")).length;
  const tuesdayCount = filteredEvents.filter((event) => 
    event.title.toLowerCase().includes("tuesday")).length;
  const wednesdayCount = filteredEvents.filter((event) => 
    event.title.toLowerCase().includes("wednesday")).length;
  const thursdayCount = filteredEvents.filter((event) => 
    event.title.toLowerCase().includes("thursday")).length;
  const fridayCount = filteredEvents.filter((event) => 
    event.title.toLowerCase().includes("friday")).length;
  const saturdayCount = filteredEvents.filter((event) => 
    event.title.toLowerCase().includes("saturday")).length;
  const sundayCount = filteredEvents.filter((event) => 
    event.title.toLowerCase().includes("sunday")).length;
  
  const daychartData = {
    labels: ["monday",  "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    datasets: [
      {
        label: "Event Count",
        data: [mondayCount, tuesdayCount, wednesdayCount, thursdayCount,fridayCount,saturdayCount,sundayCount ],
        backgroundColor: ["#deeb34", "#de008d", "#34eb71", "#34eb71", "#349ceb", "#df34eb", "#eb4934"],
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

  const filteredEventsMorons = filteredEvents.filter(
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
    <div className="flex m-0 font-sans bg-gray-100">
      <main className="p-5 flex-1 ml-36 rounded-lg shadow-lg">
        <h1 className="mb-5 font-serif ml-5 text-4xl font-bold">
          Room Usage Summary
        </h1>
        <div className="flex bg-gray-400 mb-5 w-full h-12"></div>
        <div className="grid grid-cols-3 gap-4 items-center">
          <StatisticBox
            title="Total Event"
            value={totalEventCount}
            percentage={null}
          />
          <div className="flex items-center ml-4">
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
                  className={`w-8 h-8 bg-blue-600 rounded-full shadow-md absolute transition-transform duration-300 ${
                    mode === "today" ? "translate-x-0" : mode === "week" ? "translate-x-8" : "translate-x-16"
                  }`}
                ></div>
              </div>
            </div>
            <span className="ml-2">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
          </div>
        </div>
        <nav className="mb-5">
          <button
            onClick={() => setSelectedCategory("dayChart")}
            className={`mr-3 px-3 py-2 ${
              selectedCategory === "dayChart"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Event Count
          </button>
          <button
            onClick={() => setSelectedCategory("roomChart")}
            className={`mr-3 px-3 py-2 ${
              selectedCategory === "roomChart"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Room Usage Chart
          </button>
          <button
            onClick={() => setSelectedCategory("doughnutChart")}
            className={`mr-3 px-3 py-2 ${
              selectedCategory === "doughnutChart"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Day Usage
          </button>
          <button
            onClick={() => setSelectedCategory("statistic")}
            className={`mr-3 px-3 py-2 ${
              selectedCategory === "statistic"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Statistic
          </button>
        </nav>
        <div className="grid grid-cols-1 gap-5 p-5">
          {selectedCategory === "dayChart" && (
            <div className="w-full h-[400px]">
              <Bar data={daychartData} />
            </div>
          )}
          {selectedCategory === "roomChart" && (
            <div className="w-full h-[400px]">
              <Bar data={chartData} options={{ indexAxis: "y" }} />
            </div>
          )}
          {selectedCategory === "doughnutChart" && (
            <div className="w-full h-[400px]">
              <Doughnut data={doughnutData} />
            </div>
          )}
          {selectedCategory === "statistic" && (
            <div className="w-full h-[400px]">
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
        <div className="flex mt-[20px] space-x-10">
          <div className="space-y-4">
            {Object.keys(filters).map((filter) => (
              <label
                className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition gap-4 mb-[10px]"
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
        </div>
        <input
          type="text"
          className="w-[400px] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
          placeholder="Search events"
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul className="list-none p-0 w-full max-w-xl">
          {filteredEventsMorons.map((event) => (
            <li
              key={event.id}
              className="bg-gray-100 p-4 mb-2 rounded-sm shadow-sm flex justify-between items-center"
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
             // Add a handler for the button click
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              >
                +
              </button>
            </li>
          ))}
        </ul> 
      </main>
    </div>
  );
}

export default Summary;
