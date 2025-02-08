const SpotifyWebApi = require('spotify-web-api-node');

// Configura las credenciales de tu aplicación
const spotifyApi = new SpotifyWebApi({
    clientId: 'bfa2861d23ac4a5aabff8e732d139303',  // Reemplaza con tu Client ID
    clientSecret: '5f034ad9a13d4e789767a2d2123c6952',  // Reemplaza con tu Client Secret
    redirectUri: 'http://localhost:3000/callback',  // Redirect URI configurada en el Dashboard
});

// Obtén un token de acceso
const getAccessToken = async () => {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Token de acceso obtenido correctamente.');
    } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
    }
};

// Función para obtener todos los tracks de una playlist
const getAllPlaylistTracks = async (playlistId) => {
    let allTracks = [];
    let offset = 0;
    const limit = 100;  // Máximo de tracks por solicitud

    while (true) {
        try {
            const data = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
            const tracks = data.body.items;
            allTracks = allTracks.concat(tracks);

            // Si no hay más tracks, salir del bucle
            if (!data.body.next) {
                break;
            }

            // Actualizar el offset para la siguiente página
            offset += limit;
        } catch (error) {
            console.error(`Error al obtener los tracks de la playlist ${playlistId}:`, error);
            break;
        }
    }

    return allTracks;
};

// Obtener los 200 artistas más populares
const getTopArtists = async () => {
    try {
        const playlists = [
            //poner url de las playlist donde quieren sacar los artistas es preferioble playulist locales por el tema de la region,
           // '7rZoBpWYnCu96ZNXwxvXUk',  // Top 50 Global ejemplo
           '5W7JqB6xRKr24o1XOGC41B',  // Top 50 USA
           // '7qZIpe7ZEGzszBkOF7SLvM',  // Top 50 UK
            // RapCaviar
        ];

        const artists = new Set();

        for (const playlistId of playlists) {
            try {
                const tracks = await getAllPlaylistTracks(playlistId);

                tracks.forEach((track) => {
                    track.track.artists.forEach((artist) => {
                        artists.add(artist.name);
                    });
                });

                console.log(`Artistas únicos hasta ahora: ${artists.size}`);  // Mostrar el conteo actual
                if (artists.size >= 200) break;  // Detenerse si ya tenemos 200 artistas
            } catch (error) {
                console.error(`Error al procesar la playlist ${playlistId}:`, error);
            }
        }

        const topArtists = Array.from(artists).slice(0, 200);
        console.log('Artistas más escuchados:', topArtists);
        console.log(`Total de artistas únicos encontrados: ${artists.size}`);  // Mostrar el total final
    } catch (error) {
        console.error('Error al obtener los artistas:', error);
    }
};

// Ejecutar el programa
const main = async () => {
    await getAccessToken();
    await getTopArtists();
};

main();