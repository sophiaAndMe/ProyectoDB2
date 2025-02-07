const axios = require('axios');
const qs = require('qs');

// Tus credenciales de Spotify
const clientId = '50e0feb606dc4586844bef66dbc77f50';
const clientSecret = '7271e0991a5448eaaaddc58b2fb5146e';

// Función para obtener el token de acceso
async function getSpotifyAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    try {
        const response = await axios.post(tokenUrl, qs.stringify({ grant_type: 'client_credentials' }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error al obtener el token de acceso :', error.response ? error.response.data : error);
        throw error;
    }

}

// Función para buscar y extraer información de un artista
async function searchSpotifyArtist(query) {
    try {
        const token = await getSpotifyAccessToken();
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
                spotifyUrl: artist.external_urls.spotify
            };

            console.log('Información del artista:', artistInfo);
            return artistInfo;
        } else {
            console.log('No se encontró el artista.');
        }
    } catch (error) {
        console.error('Error al buscar en Spotify:', error.response ? error.response.data : error);
    }
}

// Ejemplo de uso: Buscar información de "Coldplay"
searchSpotifyArtist('Coldplay');
