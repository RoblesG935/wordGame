const mongoose = require('mongoose');
const Esquema = mongoose.Schema;

const esquemaJuego = new Esquema({
    idUsuario: {
        type: Esquema.Types.ObjectId,
        required: true,
        ref: 'Usuario',
        unique: true,  // Asegura que un usuario solo pueda tener un juego activo
        index: true  // Indexación en idUsuario para consultas más rápidas
    },
    nombreUsuario: {
        type: String,
        required: true,
        ref: 'Usuario'
    },
    palabraActual: {
        type: String,
        required: true,
        match: /^[A-Za-z\u00C0-\u00FF]+$/  // Solo permite letras (incluye letras con acentos)
    },
    palabrasUsadas: [String],  // Lista de palabras que ya se han usado en el juego
    puntaje: {
        type: Number,
        default: 0  // Puntaje inicial del juego
    },
    juegoTerminado: {
        type: Boolean,
        default: false,
        index: true  // Indexación para filtrar juegos no activos rápidamente
    },
    ultimaLetra: {
        type: String,
        required: true
    },
    tiempoInicio: {
        type: Date,
        default: () => Date.now()  // Marca de tiempo cuando el juego comienza
    }
});

const ModeloJuego = mongoose.model('Juego', esquemaJuego, 'juegos');

module.exports = ModeloJuego;
