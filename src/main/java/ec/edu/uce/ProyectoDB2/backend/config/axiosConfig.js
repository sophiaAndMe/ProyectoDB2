const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'https://api.spotify.com/v1', // Base URL de la API de Spotify
  timeout: 70000, // Tiempo de espera en milisegundos (10 segundos)
  headers: { 'Content-Type': 'application/json' }
});

module.exports = axiosInstance;