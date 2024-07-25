import axios from 'axios';

const API_KEY = '8e4d82f938d73b8ee730140e9b48f9c5bf8fcfe874eb5058f0fe30a0b8fdd1fe';
const options = {
    method: 'GET',
    url: 'https://api.teamup.com/ksg7y4nwkfp7q6xyio/events',
    params: {startDate: '2024-07-21', endDate: '2024-07-27'},
    headers: {Accept: 'application/json', 'Teamup-Token': '123', Authorization: 'Bearer 123'}
  };
  
  try {
    const { data } = await axios.request(options);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
  
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
