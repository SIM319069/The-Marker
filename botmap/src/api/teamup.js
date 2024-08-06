import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const API_KEY =
    "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";

const getStartAndEndOfMonth = () => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    return { startOfMonth, endOfMonth };
};
const getSemesterDates = () => {
    const year = moment().year();
    const startMonth = 1; 
    const endMonth = 5; 

    const startDate = moment().year(year).month(startMonth - 1).startOf('month').format('YYYY-MM-DD');
    const endDate = moment().year(year).month(endMonth).endOf('month').format('YYYY-MM-DD');
    
    return { startDate, endDate };
};

const useFetchEvents = () => {
    const [events, setEvents] = useState([]);
    const { startOfMonth, endOfMonth } = getStartAndEndOfMonth();
    const { startDate, endDate } = getSemesterDates();
    const BASE_URL = `https://api.teamup.com/ksg7y4nwkfp7q6xyio/events?startDate=${startOfMonth}&endDate=${endOfMonth}`;
    useEffect(() => {
        axios
            .get(BASE_URL, {
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
    }, [BASE_URL]);

    return events;
};

export default useFetchEvents;
