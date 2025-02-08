const mongoose = require('mongoose');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const { getSpotifyToken, searchSpotifyArtist, getArtistAlbums, getAlbumTracks } = require('../services/spotifyService');
const conexion = require('../config/db');

// Lista de nombres de los 200 artistas más sonados (ejemplo)
const top200Artists = [
  'Jombriel',
  'Kanye West',
  'Adele'
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

      // Paso 3: Crear los objetos de artista
      const artist = new Artist({
        name: artistInfo.name,
        image: artistInfo.images[0]?.url || '', // URL de la imagen del artista
        followers: artistInfo.followers.total,
        genres: artistInfo.genres,
        popularity: artistInfo.popularity,
      });

      // Paso 4: Obtener los álbumes del artista
      const albums = await getArtistAlbums(artistInfo.id);
      const artistAlbums = [];

      for (const albumData of albums) {
        // Paso 5: Crear el álbum con referencias a canciones
        const albumSongs = [];
        const albumObj = new Album({
          name: albumData.name,
          image: albumData.images[0]?.url || '', // URL de la imagen del álbum
          releaseDate: albumData.release_date,
          totalTracks: albumData.total_tracks,
        });

        // Obtener las canciones del álbum
        const tracks = await getAlbumTracks(albumData.id);
        for (const trackData of tracks) {
          const song = new Song({
            title: trackData.name,
            duration: trackData.duration_ms,
            popularity: trackData.popularity || 0,
            url: trackData.external_urls.spotify,
            album: albumObj._id, // Referencia al álbum que se insertará
            artists: [artist._id], // Referencia al artista
          });
          songsToInsert.push(song);
          albumSongs.push(song._id); // Añadir la canción a la lista del álbum
        }

        albumObj.songs = albumSongs; // Asociar las canciones al álbum
        albumsToInsert.push(albumObj);
        artistAlbums.push(albumObj._id); // Asociar el álbum al artista
      }

      // Insertar el artista y sus álbumes
      artistsToInsert.push(artist);
      artist.albums = artistAlbums; // Asociar los álbumes al artista
    }

    // Paso 6: Insertar todos los artistas, álbumes y canciones en la base de datos
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

