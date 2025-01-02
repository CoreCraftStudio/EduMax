import axios from 'axios';


// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://core-craft-smart-classroom-c9f39cc2d22c.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;
