const Lyric = require('../models/Lyric');
const Song = require('../models/Song');
const { getLyrics } = require('../services/geniusService');

exports.fetchLyricsForSong = async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await Song.findById(songId).populate('artists');

    if (!song) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }

    const artistName = song.artists[0]?.name || 'Desconocido';
    let lyric = await Lyric.findOne({ songId });

    if (!lyric) {
      console.log(`🔍 Buscando letra para: ${song.title} - ${artistName}`);
      const lyricsText = await getLyrics(artistName, song.title);

      if (!lyricsText) {
        return res.status(404).json({ error: 'Letra no encontrada' });
      }

      lyric = await Lyric.create({ songId, lyric: lyricsText });
    }

    res.json({ song: song.title, artist: artistName, lyric: lyric.lyric });
  } catch (error) {
    console.error('❌ Error en fetchLyricsForSong:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
