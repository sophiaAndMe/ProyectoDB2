const express = require('express');
require('dotenv').config();

const spotifyRoutes = require('../controllers/spotifyController');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Ruta raíz para evitar "Cannot GET /"
app.get('/', (req, res) => {
    res.send('🎵 API funcionando correctamente 🎶');
});

// Usar rutas de Spotify
app.use('/spotify', spotifyRoutes);

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

