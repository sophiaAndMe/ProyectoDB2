// src/app.js
const express = require('express');
require('../backend/config/db'); // Se importa la conexión a MongoDB

const app = express();

// Middleware para parsear JSON (si fuera necesario)
app.use(express.json());

// Ejemplo de endpoint
app.get('/', (req, res) => {
    res.send('¡Hola, mundo! Conexión a MongoDB establecida.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
