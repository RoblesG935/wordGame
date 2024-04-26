const ModeloJuego = require('../models/game.model');
const ModeloUsuario = require('../models/user.model');
const ModeloTablaPuntuaciones = require('../models/scoreboard.model');

// Banco completo de palabras, incluyendo algunos términos coloquiales o groserías según el ejemplo original
const palabras = [
    'amarillo', 'burro', 'casa', 'dátil', 'elefante', 'fresa', 'gato', 'huevo', 'iglesia',
    'jirafa', 'kiwi', 'limón', 'manzana', 'naranja', 'ñu', 'oso', 'pato', 'queso',
    'rosa', 'sapo', 'tigre', 'uva', 'vaca', 'wafle', 'xilófono', 'yate', 'zanahoria',
    'abogado', 'botella', 'caballo', 'dragón', 'estrella', 'flor', 'grúa', 'hielo',
    'isla', 'juego', 'kilo', 'luna', 'montaña', 'nube', 'oveja', 'puente', 'quemar',
    'ratón', 'sandía', 'televisor', 'universo', 'volcán', 'windsurf', 'xenón', 'yo-yo',
    'zapato', 'árbol', 'éxito', 'índigo', 'órgano', 'útil', 'niñez', 'joya', 'araña',
    'ensalada', 'idioma', 'orquesta', 'urgencia', 'equis', 'sandwich', 'quiosco',
    'cabrón', 'gilipollas', 'cojones', 'puta', 'mierda', 'chingar', 'pendejo', 'hostia'
];

function generarPalabraAleatoria(letraInicial) {
    let filteredPalabras;

    // Si no se proporciona startingLetter, usa todas las palabras
    if (!letraInicial) {
        filteredPalabras = palabras;
    } else {
        // Verificar si startingLetter es una letra válida
        if (!/^[a-zA-Z]$/.test(letraInicial)) {
            throw new Error("Letra inicial inválida.");
        }

        // Filtrar palabras que comiencen con la letra proporcionada
        filteredPalabras = palabras.filter(palabra => palabra.toLowerCase().startsWith(letraInicial.toLowerCase()));

        // Si no hay palabras que comiencen con la letra inicial, lanzar un error
        if (filteredPalabras.length === 0) {
            throw new Error("No words start with the provided starting letter.");
        }
    }

    return filteredPalabras[Math.floor(Math.random() * filteredPalabras.length)] || null;
}

function esPalabraValida(palabraUsuario, ultimaLetra) {
    return palabraUsuario.toLowerCase() === ultimaLetra.toLowerCase();
}

/**
 * Calcula el puntaje del jugador basado en el número de palabras utilizadas.
 * @param {string[]} wordsArray - Arreglo de palabras usadas en el juego.
 * @returns {number} El puntaje calculado como la longitud del arreglo.
 */

function calcularPuntaje(arregloPalabras) {
    console.log(arregloPalabras.length)
    return arregloPalabras.length;
}

async function obtenerUltimaLetra(req, res) {
    try{
    const { juegoId } = req.params;
    const juego = await ModeloJuego.findById(juegoId);
    if (!juego) {
        return res.status(404).json({ mensaje: "Juego no encontrado" });
    }
    res.status(200).send({ ultimaLetra: juego.ultimaLetra });
} catch (error) {
    res.status(500).send({ message: "Error validando ultima letra", error: error.toString() });
}
}


async function iniciarJuego(req, res) {
    try{
    const { idUsuario } = req.body;
    const usuario = await ModeloUsuario.findById(idUsuario);
    if (!usuario) {
        return res.status(404).send({ mensaje: "Usuario no encontrado" });
    }

    const juegoExistente = await ModeloJuego.findOne({ idUsuario: idUsuario, juegoTerminado: false });
    if (juegoExistente) {
        return res.status(400).send({ mensaje: "Ya existe un juego activo para este usuario" });
    }

    const palabraActual = generarPalabraAleatoria();
    const ultimaLetra = palabraActual.slice(-1);

    const nuevoJuego = new ModeloJuego({
        idUsuario: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        palabraActual: palabraActual,
        ultimaLetra: ultimaLetra,
        puntaje: 0,
        juegoTerminado: false,
        tiempoInicio: new Date()
    });

    await nuevoJuego.save();
    res.status(201).send(nuevoJuego);
} catch (error) {
    res.status(500).send({ message: "Error creando juego", error: error.toString() });
}

}
async function jugar(req, res) {
    try {
    const { idUsuario, palabraUsuario } = req.body;

    console.log(idUsuario)
    console.log(palabraUsuario)

    if (isNaN(!palabraUsuario)){
        return res.status(400).send({ message: "Soy gay quiero salir del closet" });
    }

    const juego = await ModeloJuego.findOne({ idUsuario: idUsuario, juegoTerminado: false });
    if (!juego) {
        return res.status(404).send({ mensaje: "No se encontró un juego activo para este usuario" });
    }
   

    const tiempoLimite = 7000000000000;  // 20 segundos
    if (new Date() - juego.tiempoInicio > tiempoLimite) {
        
        juego.juegoTerminado = true;
        await juego.save();
        const userInfo = await getUserInfo(juego.idUsuario);
        return res.status(200).send({
            mensaje: "¡Se acabó el tiempo! Juego terminado.",
            nombreUsuario: userInfo.nombreUsuario,
            palabrascorrectas: juego.puntaje,
            posicion: userInfo.posicion,
          
        });
    }

    if (!esPalabraValida(palabraUsuario, juego.ultimaLetra)) {
        juego.juegoTerminado = true;
        await juego.save();
        const userInfo = await getUserInfo(juego.idUsuario);
        return res.status(400).send({
            mensaje: "Palabra inválida. Juego terminado.",
            nombreUsuario: userInfo.nombreUsuario,
            palabrascorrectas: juego.puntaje,
            posicion: userInfo.posicion
        });
    }

    juego.palabrasUsadas.push(palabraUsuario);
    const nuevaPalabra = generarPalabraAleatoria(palabraUsuario.slice(-1));
    juego.palabraActual = nuevaPalabra;
    juego.ultimaLetra = nuevaPalabra.slice(-1);
    juego.puntaje = juego.palabrasUsadas.length;
    juego.tiempoInicio = new Date();


    await juego.save();
    await updateScoreboard(juego.idUsuario, 1);


    res.status(200).send({
        mensaje: "¡Correcto! Continúa jugando.",
        juego
    });
} catch (error) {
    res.status(500).send({ message: "Error playing game, incorrect word", error: error.toString() });
}
}



async function getUserInfo(idUsuario) {
    const scoreboard = await ModeloTablaPuntuaciones.findOne();
    const userEntry = scoreboard.usuarios.find(u => u.idUsuario.equals(idUsuario));
    return {
        nombreUsuario: userEntry.nombreUsuario,
        posicion: scoreboard.usuarios.findIndex(u => u.idUsuario.equals(idUsuario)) + 1
    };
}


async function updateScoreboard(idUsuario, pointsToAdd) {
    try {
        // Verifica si existe algún registro de puntaje para el usuario
        let scoreboard = await ModeloTablaPuntuaciones.findOne({"usuarios.idUsuario": idUsuario});

        if (scoreboard) {
            // Si el usuario ya está en el scoreboard, incrementa su puntaje
            await ModeloTablaPuntuaciones.updateOne(
                { "usuario.idUsuario": idUsuario},
                { "$inc": { "usuario.$.puntaje": pointsToAdd } }
            );
        } else {
            // Si no existe un scoreboard o el usuario no está en él, crea uno o añade el usuario
           scoreboard= await ModeloTablaPuntuaciones.findOne();
            if (scoreboard) {
                // Si existe un scoreboard, añade el usuario a él
                await ModeloTablaPuntuaciones.updateOne(
                    { "_id": scoreboard._id },
                    { "$push": { "usuarios": { idUsuario: idUsuario, puntaje: pointsToAdd } } }
                );
            } else {
                // Crea un nuevo scoreboard si no existe ninguno
                scoreboard = new ModeloTablaPuntuaciones({
                    usuarios: [{ idUsuario: idUsuario, puntaje: pointsToAdd }]
                });
                await scoreboard.save();
            }
        }

        // Reordenar los usuarios en el scoreboard basado en el puntaje de manera descendente
        scoreboard = await ModeloTablaPuntuaciones.findOne(); // Recuperar el scoreboard actualizado
        if (scoreboard) {
            scoreboard.usuarios.sort((a, b) => b.puntaje - a.puntaje); // Ordenar de mayor a menor puntaje
            await scoreboard.save(); // Guardar los cambios
        }
    } catch (error) {
        console.error("Error updating the scoreboard:", error);
        throw error; // Re-throw the error for further handling if needed
    }
}

module.exports = {
    iniciarJuego,
    jugar,
    obtenerUltimaLetra,
    calcularPuntaje,
    esPalabraValida,
    generarPalabraAleatoria,
    calcularPuntaje
    
};
