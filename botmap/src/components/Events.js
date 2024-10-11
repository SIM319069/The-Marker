import React, { useState } from "react";
import "../css/Events.css";
import useFetchEvents from "../api/teamup";

function Events() {
  const events = useFetchEvents();
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

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

  const filteredEvents = events
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
    );//serch lel

  const handleAddClick = (eventId) => {
    // Handle the click event for adding an event
    console.log(`Add button clicked for event ID: ${eventId}`);
    // You can add further logic here, such as updating state or calling an API
  };

  return (
  
      <main className="flex flex-col bg-cover pl-[150px] p-[20px] bg-[#e2e2eb] ">
        <h1 className=" mb-[20px] font-serif ml-[20px] text-[50px] font-bold">
          Teamup Events
        </h1>
        <div className="mb-[20px] ">
          <div className="flex items-center justify-center gap-4">
            <h3 className="text-center text-lg font-sans md:font-serif ">
              Filters:
            </h3>
            <input
              type="text"
              className="w-[400px] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              placeholder="Search events"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex bg-navbarcolor mt-[30px] mb-[20px] w-full h-[50px] item-center justify-center"></div>

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
                    onChange={handleFilterChange}
                  />
                  <span>{filter}</span>
                </label>
              ))}
            </div>

            <ul className=" list-none p-0 w-full max-w-xl">
              {filteredEvents.map((event) => (
                <li
                  key={event.id}
                  className="bg-gray-100 p-4 mb-2 rounded-sm shadow-sm flex items-center justify-between"
                >
                  <div className="flex-1">
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
                  </div>
                  <button
                    onClick={() => handleAddClick(event.id)}
                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

  );
}

export default Events;
