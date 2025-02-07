require('dotenv').config();
const mongoose = require('mongoose');

// Cluster JHON
mongoose.connect('mongodb+srv://myAtlasDBUser:g7Thw3BScud9CsLl@myatlasclusteredu.fllri.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU')
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

