import axios from 'axios';

const API_KEY = '8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe';
const BASE_URL = 'https://api.teamup.com/ksg7y4nwkfp7q6xyio';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Teamup-Token': API_KEY,
    }
});

export const fetchData = async () => {
    try {
        const response = await apiClient.get('/events');
        return response.data;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    }
};
