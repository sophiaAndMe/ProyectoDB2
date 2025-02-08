const axios = require('axios');
require('dotenv').config();

const SPOTIFY_CLIENT_ID = "fb85aaf164224f93a71928d5aa3b34ae";
const SPOTIFY_CLIENT_SECRET = "ac4f767fe95043629afc1fb16dfc8a37";

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('Las credenciales de Spotify no están configuradas correctamente en el archivo .env');
  process.exit(1);
}

// Función para obtener el token de autenticación
const getSpotifyToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log('Token de Spotify obtenido exitosamente');
    return response.data.access_token;
  } catch (error) {
    console.error('Error obteniendo token de Spotify:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Función para buscar y extraer información de un artista
const searchSpotifyArtist = async (query) => {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`;

    const response = await axios.get(searchUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    // Verificar que se encontró al menos un artista
    if (response.data && response.data.artists && response.data.artists.items.length > 0) {
      // Se toma el primer artista encontrado
      const artist = response.data.artists.items[0];

      // Extraer la información deseada
      const artistInfo = {
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
        followers: artist.followers.total,
        images: artist.images,
        external_urls: artist.external_urls
      };

      console.log('Información del artista:', artistInfo);
      return artistInfo;
    } else {
      console.log('No se encontró el artista.');
    }
  } catch (error) {
    console.error('Error al buscar en Spotify:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Función para obtener álbumes de un artista
const getArtistAlbums = async (artistId) => {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const albumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;
    const response = await axios.get(albumsUrl, {
      headers: { 'Authorization': 'Bearer ' + token },
      params: { limit: 50 } // Máximo de álbumes
    });

    return response.data.items;
  } catch (error) {
    console.error('Error al obtener álbumes:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Función para obtener canciones de un álbum
const getAlbumTracks = async (albumId) => {
  const token = await getSpotifyToken();
  if (!token) return null;

  try {
    const tracksUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
    const response = await axios.get(tracksUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error al obtener canciones:', error.response ? error.response.data : error.message);
    return null;
  }
};

module.exports = { getSpotifyToken, searchSpotifyArtist, getArtistAlbums, getAlbumTracks };