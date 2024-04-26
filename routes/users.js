const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../controllers/user.controller');

// Ruta para registrar un nuevo usuario
router.post('/registrar', registrarUsuario);

module.exports = router;



