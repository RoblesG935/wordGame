const ModeloJuego = require("../../models/game.model").GameModel;
const ModeloUsuario= require("../../models/user.model").UserModel;
const ModeloTablaPuntuaciones = require("../../models/scoreboard.model").ModeloTablaPuntuaciones;


const supertest = require('supertest');
const app = require('../../app');  // Asegúrate de que la ruta es correcta.

describe.skip("Pruebas de validación de la API", () => {
  describe.skip("Registro de usuarios", () => {
    it("debería crear un usuario exitosamente", function (done) {
       supertest(app)
        .post('/users/registrar')
        .send({ nombreUsuario: 'NuevoUsuario' })
        .expect(201)
        .end (function (err,res){
            if(err){
                return done(err);
            }else{
                done();
            }
        })
      
    }),13000;

    it.skip("no debería aceptar nombres de usuario con caracteres especiales", function (done)  {
       supertest(app)
        .post('/users/registrar')
        .send({ nombreUsuario: 'Usuario#Invalido!' })
        .expect(500)
        .end (function (err,res){
            if(err){
                return done(err);
            }else{
                done();
            }
        })
    }),13000;
  });

 
});


  describe.skip("Interacción con el juego", () => {
    it("debería permitir enviar un ID de usuario y una palabra solo con letras", function (done) {
      supertest(app)
        .post('/game/jugar')
        .send({ idUsuario: '662b9bb97dc648ec99c5556c', palabraUsuario: 'olaTanivethPincheMamiRicaPuta' })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.mensaje).toBe("¡Correcto! Continúa jugando.");
          expect(res.body.palabraUsuario).toBeDefined();
          done();
        });
    }, 120000); // Tiempo extendido si es necesario

    it.skip("debería mantener el juego en curso y devolver una palabra", function (done) {
      supertest(app)
        .post('/game/juagar')
        .send({ idUsuario: '662a08ae43eb68354c5a6e09', palabraUsuario: 'continuar' })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).toHaveProperty('palabra');
          done();
        });
    }, 13000);
    it.skip("debería manejar respuestas tardías devolviendo el recuento de palabras y la posición en la tabla", function (done) {
      jest.useFakeTimers();
      supertest(app)
        .post('/game/play')
        .send({ idUsuario: 'userIdValido', palabraUsuario: 'tardia' })
        .end(function (err, res) {
          if (err) return done(err);
          jest.advanceTimersByTime(21000);  // Avanzar 20 segundos.
          expect(res.body).toHaveProperty('numeroDePalabras');
          expect(res.body).toHaveProperty('posicion');
          expect(res.body).toHaveProperty('mensaje', "Time's up! Game over.");
          done();
          jest.useRealTimers();
        });
    }, 13000);
    

    
  });

describe.skip("Obtención de la tabla de posiciones", () => {
  it("debería obtener las primeras diez posiciones junto con sus puntajes", function (done) {
    supertest(app)
      .get('/scoreboard/mejores-jugadores')  // Asegúrate de que esta es la ruta correcta.
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toHaveLength(10);  // Asumiendo que se devuelven exactamente 10 registros.
        res.body.forEach(player => {
          expect(player).toHaveProperty('puntaje');
          expect(player).toHaveProperty('nombreUsuario');
        });
        done();
      });
  }, 13000);
});




