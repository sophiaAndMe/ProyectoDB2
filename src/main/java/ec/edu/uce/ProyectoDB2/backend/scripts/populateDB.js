const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const spotifyService = require('../services/spotifyService');

dotenv.config();

async function populateDatabase() {
  await connectDB();
  const token = await spotifyService.getSpotifyToken();

  console.log('Obteniendo artistas...');
  let artists = await spotifyService.getTopArtists(token, 5);

  for (let artist of artists) {
    try {
      console.log(`Procesando artista: ${artist.name}`);

      // Verificar si el artista ya existe en la DB
      let existingArtist = await Artist.findOne({ name: artist.name });

      if (!existingArtist) {
        const artistDetails = await spotifyService.getArtistDetails(token, artist.id);
        artist = { ...artist, ...artistDetails };

        // Obtener álbumes del artista
        const albums = await spotifyService.getArtistAlbums(token, artist.id);
        const albumDocs = [];

        for (let album of albums) {
          console.log(`  - Procesando álbum: ${album.name}`);

          // Verificar si el álbum ya existe en la DB
          let existingAlbum = await Album.findOne({ name: album.name });

          if (!existingAlbum) {
            const tracks = await spotifyService.getAlbumTracks(token, album.id);
            const trackDocs = [];

            for (let track of tracks) {
              console.log(`    - Guardando canción: ${track.title}`);

              let existingSong = await Song.findOne({ title: track.title });

              if (!existingSong) {
                const songDoc = await Song.create({
                  title: track.title,
                  duration: track.duration,
                  popularity: track.popularity,
                  url: track.url
                });
                trackDocs.push(songDoc._id);
              }
            }

            // Guardar álbum con referencias a canciones
            const albumDoc = await Album.create({
              name: album.name,
              image: album.image,
              releaseDate: album.releaseDate,
              totalTracks: album.totalTracks,
              songs: trackDocs
            });
            albumDocs.push(albumDoc._id);
          }
        }

        // Guardar artista con referencias a álbumes
        const artistDoc = await Artist.create({
          name: artist.name,
          image: artist.image,
          followers: artist.followers,
          genres: artist.genres,
          popularity: artist.popularity,
          albums: albumDocs
        });

        console.log(`✅ Artista guardado: ${artist.name}`);
      } else {
        console.log(`⚠️ Artista ya existente: ${artist.name}, omitiendo...`);
      }

    } catch (error) {
      console.error(`❌ Error procesando artista ${artist.name}:`, error.message);
    }
  }

  console.log('✅ Base de datos poblada correctamente.');
  mongoose.disconnect();
}

populateDatabase().catch(err => console.error(err));
