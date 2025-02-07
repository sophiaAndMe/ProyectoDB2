const conexion = require('../DataBase/db');
const Cancion = require('../Modelos/Cancion');

const prueba = async () => {
  await conexion;

  // Insertar un documento de prueba
  const nuevaCancion = new Cancion({
    titulo: 'Canción de prueba',
    artista: 'Artista de prueba',
    letra: 'Letra de prueba...',
    album: 'Álbum de prueba',
    foto: 'https://ejemplo.com/foto.jpg'
  });

  await nuevaCancion.save();
  console.log('Canción guardada correctamente');
};

prueba();