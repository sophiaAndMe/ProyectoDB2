const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
  try {

    const conn = await mongoose.connect("mongodb+srv://adminOsorio:diego123456@spotifyproyecto.ynrks.mongodb.net/?retryWrites=true&w=majority&appName=SpotifyProyecto", {

    });
    console.log(`✅ Conectado a MongoDB en ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
