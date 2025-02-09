const mongoose = require('mongoose');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const { getLyrics } = require('../services/geniusService');
const conexion = require('../config/db');

const populateLyrics = async () => {
  try {
    await conexion(); // Conectar a la base de datos

    const songs = await Song.find().populate('artists');

    for (const song of songs) {
      if (song.lyrics && song.lyrics.trim() !== '') {
        console.log(`⏩ Lyrics ya existen para: ${song.title}`);
        continue;
      }

      const artist = await Artist.findById(song.artists[0]);
      const artistName = artist ? artist.name : 'Desconocido';

      console.log(`🔍 Obteniendo lyrics para: ${song.title} - ${artistName}`);
      const lyrics = await getLyrics(artistName, song.title);

      if (lyrics) {
        await Song.updateOne({ _id: song._id }, { $set: { lyrics } });
        console.log(`✅ Lyrics agregados a: ${song.title}`);
      } else {
        console.log(`⚠️ No se encontraron lyrics para: ${song.title}`);
      }
    }

    console.log('🎉 Lyrics agregados correctamente a las canciones.');
  } catch (error) {
    console.error('❌ Error al poblar las lyrics:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar script
populateLyrics();


