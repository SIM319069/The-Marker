import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Import the Chart.js library
import "../css/Events.css"; // Import the CSS file
import StatisticBox from "./StatisticBox"; // Import the StatisticBox component

const API_KEY =
	"8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";
const BASE_URL = "https://api.teamup.com/ksg7y4nwkfp7q6xyio";

function Events() {
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
		axios
			.get(`${BASE_URL}/events`, {
				headers: {
					"Teamup-Token": API_KEY,
				},
			})
			.then((response) => {
				setEvents(response.data.events);
				console.log("Fetched data: ", response.data);
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
			});
	}, []);

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
		);
	const totalFilteredEventsCount = filteredEvents.length;

	const totalEventCount = events.length; // all event that we have

	const cpeCount = events.filter((event) => event.title.includes("cpe")).length;
	const mcpeCount = events.filter((event) =>
		event.title.includes("mcpe")
	).length;
	const isneCount = events.filter((event) =>
		event.title.includes("isne")
	).length;

	const chartData = {
		labels: ["CPE", "MCPE", "ISNE"],
		datasets: [
			{
				label: "Event Count",
				data: [cpeCount, mcpeCount, isneCount],
				backgroundColor: ["rgba(255,99,132,0.2)", "#ff6384", "#ffcd56"],
			},
		],
	};

	return (
		<div className="flex m-0 bg-[rgb(245,249,255) min-h-screen]">
			<main className="flex-1 p-0 ml-[150px] p-[20px]">
				<h1 className=" mb-[20px] font-serif ml-[20px] text-[50px] font-bold">
					Teamup Events
				</h1>
				<div className="flex bg-gray-400 mb-[20px] w-[1650px] h-[50px] item-center justify-center"></div>
				<div className="grid grid-cols-3 gap-4">
					<StatisticBox
						title="Total Event"
						value={totalEventCount}
						percentage={null}
					/>
					<StatisticBox
						title="Total Filtered Events"
						value={totalFilteredEventsCount}
						percentage={null}
					/>
					<StatisticBox
						title="Total Filtered Events"
						value={totalFilteredEventsCount}
						percentage={null}
					/>
					<StatisticBox
						title="Total Filtered Events"
						value={totalFilteredEventsCount}
						percentage={null}
					/>
				</div>
				<div className=" grid grid-cols-2 p-[20px] p-[20px] flex item-center w-[500px]">
					<Bar className="bg-gray-100" data={chartData} />
					<Bar className="bg-gray-100" data={chartData} />
					<Bar className="bg-gray-100" data={chartData} />
					<Bar className="bg-gray-100" data={chartData} />
					<Bar className="bg-gray-100" data={chartData} />
				</div>
				{/* can't set themultiple bar like the statistic box (can someone help me?)*/}

				<div className="mb-[20px] ml-[25px]">
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

					<div className="flex bg-navbarcolor mt-[30px] mb-[20px] w-[1650px] h-[50px] item-center justify-center"></div>

					<div className="flex mt-[20px]">
						<div className=" mr-[10px]">
							{Object.keys(filters).map((filter) => (
								<label
									className="grid grid-cols-3 gap-4 mb-[10px] "
									key={filter}>
									<input
										type="checkbox"
										className="ml-[75px] text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										name={filter}
										checked={filters[filter]}
										onChange={handleFilterChange}
									/>
									{filter}
								</label>
							))}
						</div>

						<ul className="list-none p-0 w-full max-w-xl">
							{filteredEvents.map((event) => (
								<li
									key={event.id}
									className="bg-gray-100 p-4 mb-2 rounded-sm shadow-sm">
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
					</div>
				</div>
			</main>
		</div>
	);
}

export default Events;
