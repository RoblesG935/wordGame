const ModeloTablaPuntuaciones = require('../models/scoreboard.model');
const ModeloUsuario = require('../models/user.model');

async function crearTablaPuntuaciones(req, res) {
    try {
        // Verificar si ya existe un scoreboard
        const existingTablaPuntuaciones = await ModeloTablaPuntuaciones.findOne();
        if (existingTablaPuntuaciones) {
            return res.status(400).send({ message: "Tabla de puntuaciones existente" });
        }

        const newScoreboard = new ModeloTablaPuntuaciones({
            usuarios: []
        });

        await newScoreboard.save();
        res.status(201).send(newScoreboard);
    } catch (error) {
        res.status(500).send({ message: "Error creando tabla de puntuaciones", error: error.toString() });
    }
}

async function añadirUsuario(req, res) {
    try {
        const { idUsuario} = req.body;
        const usuario = await ModeloUsuario.findById(idUsuario);
        if (!usuario) {
            return res.status(404).send({ mensaje: "Usuario no encontrado" });
        }

        const tablaPuntuaciones = await ModeloTablaPuntuaciones.findOne();
        if (!tablaPuntuaciones) {
            return res.status(404).send({ mensaje: "Tabla de puntuaciones no encontrada" });
        }

        let entradaUsuario = tablaPuntuaciones.usuarios.find(u => u.idUsuario.equals(idUsuario));
        if (entradaUsuario) {
            entradaUsuario.nombreUsuario = usuario.nombreUsuario;
            entradaUsuario.puntaje = req.body.puntaje || entradaUsuario.puntaje;
        } else {
            tablaPuntuaciones.usuarios.push({ idUsuario: usuario._id, nombreUsuario: usuario.nombreUsuario, puntaje: req.body.puntaje || 0 });
        }

        tablaPuntuaciones.usuarios.sort((a, b) => b.puntaje - a.puntaje);
        await tablaPuntuaciones.save();
        res.status(200).send(tablaPuntuaciones);
    } catch (error) {
        res.status(500).send({ mensaje: "Error al añadir usuario a la tabla de puntuaciones", error: error.toString() });
    }
}

async function obtenerMejoresJugadores(req, res) {
    try {
        const tablaPuntuaciones = await ModeloTablaPuntuaciones.findOne().populate({
            path: 'usuarios.idUsuario',
            select: 'nombreUsuario puntaje'
    });
        if (!tablaPuntuaciones) {
            return res.status(404).send({ mensaje: "Tabla de puntuaciones no encontrada" });
        }
        res.status(200).send(tablaPuntuaciones.usuarios.slice(0, 10));
    } catch (error) {
        res.status(500).send({ mensaje: "Error al obtener los mejores jugadores", error: error.toString() });
    }
}

module.exports = {
    crearTablaPuntuaciones,
    añadirUsuario,
    obtenerMejoresJugadores
};
