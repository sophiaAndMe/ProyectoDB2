const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // URL de imagen 320x320
  followers: { type: Number, required: true },
  genres: { type: [String], required: true },
  popularity: { type: Number, required: true },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }] // Referencias a álbumes
});

module.exports = mongoose.model('Artist', artistSchema);