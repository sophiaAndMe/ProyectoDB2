const mongoose = require('mongoose');

const conexion = async () => {
  try {
    await mongoose.connect('mongodb+srv://adminOsorio:diego123456@spotifyproyecto.ynrks.mongodb.net/?retryWrites=true&w=majority&appName=SpotifyProyecto', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
  }
};
module.exports = conexion;