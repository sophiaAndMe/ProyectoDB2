const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://adminOsorio:diego123456@spotifyproyecto.ynrks.mongodb.net/ProyectoDB2?retryWrites=true&w=majority&appName=SpotifyProyecto", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 70000, // Tiempo de espera en milisegundos (30 segundos)
      serverSelectionTimeoutMS: 90000, // Aumenta el tiempo de espera (50 segundos)
      socketTimeoutMS: 95000 // Aumenta el tiempo de espera del socket (45 segundos)
    });
    console.log(`✅ Conectado a MongoDB en ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
