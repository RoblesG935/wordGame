const mongoose = require('mongoose');
const Esquema = mongoose.Schema;

const esquemaTablaPuntuaciones = new Esquema({
    usuarios: [{
        idUsuario: { type: Esquema.Types.ObjectId, ref: 'Usuario', required: true },
        nombreUsuario: { type: String, required: true },
        puntaje: { type: Number, required: true, default: 0 }
    }]
});

const ModeloTablaPuntuaciones = mongoose.model('TablaPuntuaciones', esquemaTablaPuntuaciones, 'tablaPuntuaciones');

module.exports = ModeloTablaPuntuaciones;
