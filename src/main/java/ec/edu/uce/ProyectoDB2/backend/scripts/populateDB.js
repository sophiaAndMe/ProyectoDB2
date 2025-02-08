const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const { getSpotifyToken, searchSpotifyArtist, getArtistAlbums, getAlbumTracks } = require('../services/spotifyService');
const conexion = require('../config/db');

// Lista de nombres de los 200 artistas más sonados (ejemplo)
const top200Artists = [
  'Kanye West',
  // Agrega los nombres de los 200 artistas aquí
];

const populateDB = async () => {
  try {
    // Conectar a MongoDB
    await conexion();

    const artistsToInsert = [];
    const albumsToInsert = [];
    const songsToInsert = [];

    for (const artistName of top200Artists) {
      // Paso 1: Buscar el artista en Spotify
      const artistInfo = await searchSpotifyArtist(artistName);

      if (!artistInfo) {
        console.log(`No se encontró el artista "${artistName}" en Spotify.`);
        continue;
      }

      // Paso 2: Verificar si el artista ya existe en MongoDB
      const existingArtist = await Artist.findOne({ name: artistInfo.name });
      if (existingArtist) {
        console.log(`El artista "${artistInfo.name}" ya existe en la base de datos.`);
        continue;
      }

      // Paso 3: Obtener álbumes del artista
      const albums = await getArtistAlbums(artistInfo.id);
      const artistAlbums = [];
      const artistSongs = [];

      for (const albumData of albums) {
        // Paso 4: Obtener canciones del álbum
        const tracks = await getAlbumTracks(albumData.id);
        const albumSongs = [];

        for (const trackData of tracks) {
          const song = {
            title: trackData.name,
            duration: trackData.duration_ms,
            popularity: trackData.popularity || 0,
            url: trackData.external_urls.spotify,
            album: null, // Se actualizará después de insertar el álbum
            artists: [] // Se actualizará después de insertar el artista
          };
          songsToInsert.push(song);
          albumSongs.push(song);
        }

        const album = {
          name: albumData.name,
          image: albumData.images[0]?.url || '', // URL de la imagen del álbum
          releaseDate: albumData.release_date,
          totalTracks: albumData.total_tracks,
          songs: albumSongs.map(song => song._id) // Referencias a canciones
        };
        albumsToInsert.push(album);
        artistAlbums.push(album);
      }

      const artist = {
        name: artistInfo.name,
        image: artistInfo.images[0]?.url || '', // URL de la imagen del artista
        followers: artistInfo.followers.total,
        genres: artistInfo.genres,
        popularity: artistInfo.popularity,
        albums: artistAlbums.map(album => album._id) // Referencias a álbumes
      };
      artistsToInsert.push(artist);
    }

    // Paso 5: Insertar datos en MongoDB
    const insertedArtists = await Artist.create(artistsToInsert);
    const insertedAlbums = await Album.create(albumsToInsert);
    const insertedSongs = await Song.create(songsToInsert);

    console.log('Datos guardados exitosamente!');
    console.log(`Artistas insertados: ${insertedArtists.length}`);
    console.log(`Álbumes insertados: ${insertedAlbums.length}`);
    console.log(`Canciones insertadas: ${insertedSongs.length}`);
  } catch (error) {
    console.error('Error en el script de población:', error);
  } finally {
    mongoose.connection.close(); // Cerrar la conexión
  }
};

// Ejecutar el script
populateDB();
