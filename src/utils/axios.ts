import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Your backend API URL
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});


export default api;
