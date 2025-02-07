const express = require('express');
const { searchSpotify } = require('../services/spotifyService');

const router = express.Router();

router.get('/buscar', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });

  const data = await searchSpotify(query);
  if (!data) return res.status(500).json({ error: 'Error obteniendo datos de Spotify' });

  res.json(data);
});

module.exports = router;
