import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Events from "./components/Events";
import NavBar from "./components/NavBar";
import StatisticBox from "./components/StatisticBox";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Import the Chart.js library

const API_KEY = "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";
const BASE_URL = "https://api.teamup.com/ksg7y4nwkfp7q6xyio";

const App = () => {
    const [events, setEvents] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
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

                const cpeCount = response.data.events.filter((event) => event.title.includes("cpe")).length;
                const mcpeCount = response.data.events.filter((event) => event.title.includes("mcpe")).length;
                const isneCount = response.data.events.filter((event) => event.title.includes("isne")).length;

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

                setChartData(chartData);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    const totalEventCount = events.length;


    return (
        <Router>
            <div className="">
                <NavBar />
                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/events" element={<Events events={events} setChartData={setChartData} />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/" element={
                        <div className="flex m-0 bg-[rgb(245,249,255) min-h-screen]">
                            <main className="flex-1 ml-[150px] p-[20px]">
                                <h1 className="mb-[20px] font-serif ml-[20px] text-[50px] font-bold">
                                    Main page
                                </h1>
                                <div className="flex bg-gray-400 mb-[20px] w-[1650px] h-[50px] item-center justify-center"></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <StatisticBox
                                        title="Total Event"
                                        value={totalEventCount}
                                        percentage={null}
                                    />
                                    
                                </div>
                                <div className="grid grid-cols-2 py-4 item-center w-[500px]">
                                    <Bar
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                </div>
                            </main>
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

const About = () => {
    return <div>About Page</div>;
};

const Contact = () => {
    return <div>Contact Page</div>;
};

export default App;
