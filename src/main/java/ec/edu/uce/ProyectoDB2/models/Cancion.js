const mongoose = require('mongoose');

const cancionSchema = new mongoose.Schema({
  titulo: String,
  artista: String,
  letra: String,
  album: String,
  foto: String
});

const Cancion = mongoose.model('Cancion', cancionSchema);

module.exports = Cancion;