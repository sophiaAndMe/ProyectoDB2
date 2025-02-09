const spotifyService = require('../services/spotifyService');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');

exports.searchArtists = async (req, res) => {
  try {
    const { query } = req.params;
    const artists = await Artist.find({ $text: { $search: query } }).limit(11);
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopArtists = async (req, res) => {
  try {
    const artists = await spotifyService.getTopArtists();
    res.json(artists);
  } catch (error) {
    console.error('❌ Error en getTopArtists:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.searchAlbums = async (req, res) => {
  try {
    const { query } = req.params;
    const albums = await Album.find({ $text: { $search: query } }).limit(10);
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchSongs = async (req, res) => {
  try {
    const { query } = req.params;
    const songs = await Song.find({ $text: { $search: query } }).limit(10);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


