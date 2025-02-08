const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }], // Referencias a artistas
  duration: { type: Number, required: true }, // Duración en milisegundos
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' }, // Referencia al álbum
  url: { type: String, required: true } // URL de Spotify
});

// Índice para búsquedas full-text
songSchema.index({ title: 'text' });

module.exports = mongoose.model('Song', songSchema);



