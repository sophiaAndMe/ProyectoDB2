const express = require('express');
const { fetchLyricsForSong } = require('../controllers/geniusController');
const router = express.Router();

router.get('/lyrics/:songId', fetchLyricsForSong);

module.exports = router;
