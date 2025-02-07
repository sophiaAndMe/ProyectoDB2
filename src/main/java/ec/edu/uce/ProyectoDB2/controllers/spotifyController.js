const express = require('express');
const { getSpotifyToken } = require('../DataBase/spotifyService');
const axios = require('axios');

const router = express.Router();

// Ruta para buscar un artista en Spotify
router.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Se requiere un parámetro de búsqueda.' });
    }

    try {
        const token = await getSpotifyToken();

        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                q: query,
                type: 'artist',
                limit: 1
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error buscando en Spotify:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error en la búsqueda de Spotify.' });
    }
});

module.exports = router;
