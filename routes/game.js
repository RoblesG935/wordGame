const express = require('express');
const router = express.Router();
const { iniciarJuego, jugar, obtenerUltimaLetra } = require('../controllers/game.controller');

// Ruta para iniciar un nuevo juego
router.post('/nuevo-juego', iniciarJuego);

// Ruta para procesar una jugada en un juego existente
router.post('/jugar', jugar);

router.get('/obtener/:juegoId', obtenerUltimaLetra);

module.exports = router;

