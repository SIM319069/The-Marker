import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const API_KEY =
    "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";

const getStartAndEndOfWeek = () => {
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');
    return { startOfWeek, endOfWeek };
};

const useFetchEvents = () => {
    const [events, setEvents] = useState([]);
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
    const BASE_URL = `https://api.teamup.com/ksg7y4nwkfp7q6xyio/events?startDate=${startOfWeek}&endDate=${endOfWeek}`;

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