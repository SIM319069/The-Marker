import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

// API key for Teamup API - Used for authenticating requests
const API_KEY =
    "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";

// Function to calculate the start and end dates of the current month
// Returns the dates in 'YYYY-MM-DD' format, which is commonly used in APIs
const getStartAndEndOfMonth = () => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD'); // Get the first day of the current month
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD'); // Get the last day of the current month
    return { startOfMonth, endOfMonth }; // Return an object containing both dates
};

// Function to calculate the start and end dates of a predefined semester period
// Assumes the semester starts in January and ends in May of the current year
const getSemesterDates = () => {
    const year = moment().year(); // Get the current year
    const startMonth = 1; // January as the start month
    const endMonth = 5; // May as the end month

    // Calculate the start and end dates for the semester based on the months defined
    const startDate = moment().year(year).month(startMonth - 1).startOf('month').format('YYYY-MM-DD'); // First day of January
    const endDate = moment().year(year).month(endMonth).endOf('month').format('YYYY-MM-DD'); // Last day of May
    
    return { startDate, endDate }; // Return an object containing the semester's start and end dates
};

// Custom hook to fetch event data from the Teamup API based on the current month's dates
const useFetchEvents = () => {
    const [events, setEvents] = useState([]); // State variable to store the list of events

    // Destructure the start and end of the current month from the getStartAndEndOfMonth function
    const { startOfMonth, endOfMonth } = getStartAndEndOfMonth();
    
    // Destructure the start and end dates of the semester from the getSemesterDates function
    const { startDate, endDate } = getSemesterDates(); 
    
    // URL used to fetch events, with the start and end dates for the current month
    const BASE_URL = `https://api.teamup.com/ksg7y4nwkfp7q6xyio/events?startDate=${startOfMonth}&endDate=${endOfMonth}`;

    // Effect hook to fetch data from the API whenever BASE_URL changes (i.e., when the date range changes)
    useEffect(() => {
        // Axios GET request to fetch events using the API key for authentication
        axios
            .get(BASE_URL, {
                headers: {
                    "Teamup-Token": API_KEY, // API key passed in the headers
                },
            })
            .then((response) => {
                setEvents(response.data.events); // Store the fetched events in state
                console.log("Fetched data: ", response.data); // Log the response data for debugging
            })
            .catch((error) => {
                console.error("Error fetching data: ", error); // Log errors if the request fails
            });
    }, [BASE_URL]); // Only re-run this effect if BASE_URL changes (based on start/end dates)

    return events; // Return the list of events fetched from the API
};

export default useFetchEvents; // Export the custom hook for use in other components
