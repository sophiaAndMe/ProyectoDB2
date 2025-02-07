const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }], // Referencias a artistas
  duration: { type: Number, required: true }, // Duración en milisegundos
  popularity: { type: Number, required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' }, // Referencia al álbum
  url: { type: String, required: true } // URL de Spotify
});

module.exports = mongoose.model('Song', songSchema);