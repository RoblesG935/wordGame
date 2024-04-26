const mongoose = require('mongoose');
const Esquema = mongoose.Schema;

const esquemaUsuario = new Esquema({
    nombreUsuario: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        match: /^[a-zA-Z0-9]+$/
    },
    puntaje: {
        type: Number,
        default: 0
    }
});

const ModeloUsuario = mongoose.model('Usuario', esquemaUsuario, 'usuarios');

module.exports = ModeloUsuario;





