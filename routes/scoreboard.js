const express = require('express');
const router = express.Router();
const { crearTablaPuntuaciones, añadirUsuario, obtenerMejoresJugadores } = require('../controllers/scoreboard.controller');

router.post('/nueva-tabla', crearTablaPuntuaciones);
router.post('/add-usuario', añadirUsuario);
router.get('/mejores-jugadores', obtenerMejoresJugadores);

module.exports = router;

