const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // URL de imagen
  releaseDate: { type: Date, required: true },
  totalTracks: { type: Number, required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] // Referencias a canciones
});

module.exports = mongoose.model('Album', albumSchema);