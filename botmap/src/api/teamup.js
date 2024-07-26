import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const API_KEY = "8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe";

const getStartAndEndOfWeek = () => {
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');
    return { startOfWeek, endOfWeek };
};

const useFetchEvents = () => {
    const [events, setEvents] = useState([]);
    const [subcalendarIds, setSubcalendarIds] = useState([]);
    const [subcalendarDetails, setSubcalendarDetails] = useState([]);
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
    const BASE_URL = `https://api.teamup.com/ksg7y4nwkfp7q6xyio/events?startDate=${startOfWeek}&endDate=${endOfWeek}`;
    const BASE_URL2 = `https://api.teamup.com/ksg7y4nwkfp7q6xyio/subcalendars/`;

    useEffect(() => {
        axios
            .get(BASE_URL, {
                headers: {
                    "Teamup-Token": API_KEY,
                },
            })
            .then((response) => {
                const fetchedEvents = response.data.events;
                setEvents(fetchedEvents);

                // Extract and store subcalendar_ids
                const ids = fetchedEvents.map(event => event.subcalendar_id);
                setSubcalendarIds([...new Set(ids)]); // Remove duplicates
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, [BASE_URL]);

    useEffect(() => {
        const fetchSubcalendarDetails = async () => {
            const detailsArray = [];

            for (const id of subcalendarIds) {
                try {
                    const response = await axios.get(`${BASE_URL2}${id}`, {
                        headers: {
                            "Teamup-Token": API_KEY,
                        },
                    });
                    detailsArray.push(response.data);
                } catch (error) {
                    console.error(`Error fetching subcalendar ${id}: `, error);
                }
            }

            setSubcalendarDetails(detailsArray);
        };

        if (subcalendarIds.length > 0) {
            fetchSubcalendarDetails();
        }
    }, [subcalendarIds]);
    console.log(subcalendarDetails);

    return { events, subcalendarDetails };
};

export default useFetchEvents;
