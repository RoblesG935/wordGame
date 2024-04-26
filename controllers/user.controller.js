const ModeloUsuario = require('../models/user.model');

async function registrarUsuario(req, res) {
    try {
        const { nombreUsuario, puntaje } = req.body;

        const nuevoUsuario = new ModeloUsuario({
            nombreUsuario,
            puntaje
        });

        await nuevoUsuario.save();
        res.status(201).send(nuevoUsuario);
    } catch (error) {
        res.status(500).send({ mensaje: "Nombre de usuario inválido", error: error.toString() });
    }
}

module.exports = {
    registrarUsuario
};
