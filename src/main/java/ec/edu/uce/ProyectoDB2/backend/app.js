const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db'); // Conexión a MongoDB
const artistRoutes = require('./routes/artists'); // Rutas de artistas
const albumRoutes = require('./routes/albums');   // Rutas de álbumes
const songRoutes = require('./routes/songs');     // Rutas de canciones

const app = express();
app.use(cors());
app.use(express.json());

// Definir las rutas
app.use('/api/artists', artistRoutes);  // Cambio aquí
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);

const Artist = require("./models/Artist");
const Album = require("./models/Album");
const Song = require("./models/Song");

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Spotify');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
