const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

router.get('/search/artists/:query', spotifyController.searchArtists);
router.get('/search/albums/:query', spotifyController.searchAlbums);
router.get('/search/songs/:query', spotifyController.searchSongs);

module.exports = router;