const httpMocks = require('node-mocks-http');
const { obtenerUltimaLetra, generarPalabraAleatoria, calcularPuntaje } = require('../../controllers/game.controller');

jest.mock('../../models/user.model', () => ({
    findById: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn()
  }));
  
  jest.mock('../../models/game.model', () => {
    return {
      findById: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn()
    };
  });
  const ModeloUsuario = require('../../models/user.model');
  const ModeloJuego = require('../../models/game.model');

describe.skip('La API deberá de cumplir con los siguientes funciones internas y validaciones:', () => {
    describe('obtenerUltimaLetra', () => {
        beforeEach(() => {
          // Reset mocks before each test
          ModeloJuego.findById.mockClear();
          ModeloJuego.findOne.mockClear();
          ModeloJuego.updateOne.mockClear();
        });

    it('debería devolver 404 si no se encuentra el juego', async () => {
        ModeloJuego.findById.mockResolvedValue(null);
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/juego/123',
        params: { gameId: '123' }
      });
      const res = httpMocks.createResponse();
      await obtenerUltimaLetra(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ mensaje: "Juego no encontrado" });
    });

    it('debería devolver 200 y la última letra del juego', async () => {
        ModeloJuego.findById.mockResolvedValue({ ultimaLetra: 'Z' });
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/juego/507f1f77bcf86cd799439011',
        params: { gameId: '507f1f77bcf86cd799439011' }
      });
      const res = httpMocks.createResponse();
      await obtenerUltimaLetra(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({ ultimaLetra: 'Z' });
    });
  });

  describe('seleccionarPalabraAleatoria', () => {
    it('debería devolver una palabra que comienza con la letra dada', () => {
      const palabras = ['manzana', 'mango', 'banana', 'mora', 'melon'];
      const funcionRandomica = () => 0;
      const palabra = generarPalabraAleatoria('m', palabras, funcionRandomica);
      expect(palabra).toMatch(/^m/i);
    });

    it('debería lanzar un error por letras iniciales inválidas', () => {
      expect(() => generarPalabraAleatoria('1', ['manzana', 'banana'], () => 0)).toThrow("Letra inicial inválida.");
    });
  });

  describe('calcularPuntajeJugador', () => {
    it('debería devolver la longitud del arreglo de palabras utilizadas', () => {
      const palabras = ['manzana', 'mango', 'banana', 'mora', 'melon'];
      expect(calcularPuntaje(palabras)).toBe(5);
    });
  });
  describe('Deberá  tener  una  función  que  calcule  el  puntaje  del  jugador  con  cada  palabra  que devuelva,  este  puntaje  deberá  ser  basado  en  el  conteo  del  arreglo  de  palabras  que  se han utilizado en el juego', () => {
    it('Prueba unitaria que reciba como parámetro un arreglo y devuelva la longitud del mismo', () => {
        const palabras = ['apple', 'apricot', 'banana', 'blueberry', 'avocado'];
      
        expect(calcularPuntaje(palabras)).toBe(5);
  
    });
  
  });
});
