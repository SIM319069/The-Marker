import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import StatisticBox from "./StatisticBox";
import useFetchEvents from "../api/teamup";

function Summary() {
  const [selectedCategory, setSelectedCategory] = useState("majorChart");
  const [mode, setMode] = useState("today"); // Added state for mode
  const events = useFetchEvents(); // Use the custom hook to fetch events data
  const [filters, setFilters] = useState({
    cpe: false,
    mcpe: false,
    isne: false,
    RoomReservation: false,
    Xternalmcpe: false,
    XternalUndergrad: false,
});
const [searchTerm, setSearchTerm] = useState("");
const handleSearch = (event) => {
  setSearchTerm(event.target.value);
};


  // Filter events based on selected mode
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const handleFilterChangemorons = (event) => {
    setFilters({
        ...filters,
        [event.target.name]: event.target.checked,
    });
};
const filterEvents = (event) => {
  let include = true;
  if (filters.cpe && !event.title.includes("cpe")) include = false;
  if (filters.mcpe && !event.title.includes("mcpe")) include = false;
  if (filters.isne && !event.title.includes("isne")) include = false;
  if (filters.RoomReservation && !event.title.includes("Room reservation"))
      include = false;
  if (filters.Xternalmcpe && !event.title.includes("xternal mcpe"))
      include = false;
  if (filters.XternalUndergrad && !event.title.includes("xternal Undergrad"))
      include = false;
  return include;
};


  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start_dt);
    if (mode === "today") {
      return eventDate >= startOfDay && eventDate <= endOfDay;
    }
    return true; // No filter for overall mode
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
        ), // Generate colors
      },
    ],
  };

  const majorUsage = Object.values(roomUsage).reduce(
    (acc, usage) => {
      Object.keys(usage.majors).forEach((major) => {
        if (!acc[major]) {
          acc[major] = 0;
        }
        acc[major] += usage.majors[major];
      });
      return acc;
    },
    { CPE: 0, MCPE: 0, ISNE: 0, OTHER: 0 }
  );

  const doughnutData = {
    labels: ["ISNE", "CPE", "MCPE", "OTHER"],
    datasets: [
      {
        label: "Major Usage",
        data: [
          majorUsage.ISNE,
          majorUsage.CPE,
          majorUsage.MCPE,
          majorUsage.OTHER,
        ],
        backgroundColor: ["#36a2eb", "#ff9f40", "#4bc0c0", "#ff6384"], // Colors for each major
      },
    ],
  };

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

  const totalEventCount = filteredEvents.length;

  // Statistic calculations
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
  ).toFixed(2); // in minutes

  // Peak Usage Hour Calculation
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

      const filteredEventsMorons = events.filter((event) => filterEvents(event)).filter(
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
                onChange={() => setMode(mode === "today" ? "overall" : "today")}
                className="sr-only"
              />
              <div
                onClick={() => setMode(mode === "today" ? "overall" : "today")}
                className="w-16 h-8 bg-gray-300 rounded-full cursor-pointer relative flex items-center"
              >
                <div
                  className={`w-8 h-8 bg-blue-600 rounded-full shadow-md absolute transition-transform duration-300 ${
                    mode === "today" ? "translate-x-8" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
            <span className="ml-2">
              {mode === "today" ? "Today" : "Overall"}
            </span>
          </div>
        </div>
        <nav className="mb-5">
          <button
            onClick={() => setSelectedCategory("majorChart")}
            className={`mr-3 px-3 py-2 ${
              selectedCategory === "majorChart"
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
            Major Usage
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
          {selectedCategory === "majorChart" && (
            <div className="w-full h-[400px]">
              <Bar data={majorchartData} />
            </div>
          )}
          {selectedCategory === "roomChart" && (
            <div className="w-full h-[400px]">
              <Bar data={chartData} options={{ indexAxis: "y" }} />{" "}
              {/* Horizontal Bar Chart */}
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
          <div className=" space-y-4">
            {Object.keys(filters).map((filter) => (
              <label
                className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition gap-4 mb-[10px] "
                key={filter}
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  name={filter}
                  checked={filters[filter]}
                  onChange={handleFilterChangemorons}
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
        <ul className=" list-none p-0 w-full max-w-xl">
          {filteredEventsMorons.map((event) => (
            <li
              key={event.id}
              className="bg-gray-100 p-4 mb-2 rounded-sm shadow-sm"
            >
              <h2 className="mb-[10px]">{event.title}</h2>
              <p className="my-[5px]">
                <strong>Date:</strong>{" "}
                {new Date(event.start_dt).toLocaleDateString()}
              </p>
              <p className="my-[5px]">
                <strong>Time:</strong>{" "}
                {new Date(event.start_dt).toLocaleTimeString()} -{" "}
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
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default Summary;