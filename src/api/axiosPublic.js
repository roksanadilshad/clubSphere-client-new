// src/api/axiosPublic.js
import axios from 'axios';

const axiosPublic = axios.create({
  baseURL: 'https://club-sphere-server-new.vercel.app',
});

export default axiosPublic;
