import http from 'http';
import request from 'supertest';
import Server from './../src/server';
import { MongoMemoryServer } from 'mongodb-memory-server';

let server: null | http.Server = null;
let mongoServer: MongoMemoryServer = null;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  const instance = new Server({ mongo_uri: uri, port: getRandomInt(4000, 10000) });
  server = http.createServer(instance.initiate().listen().callback());
});

afterEach(async () => {
  server?.close();
  await mongoServer.stop();
});

describe('POST /registrar-venta', () => {
  it('should not create a new sell', () => {
    return request(server)
      .post('/registrar-venta')
      .send({
        fecha: '2020-01-18',
        cantidad: 5,
        idProducto: 1,
        nombreProducto: 'Calabaza',
      })
      .expect(400);
  });
});

describe('GET /sells', () => {
  it('should return sells', () => {
    return request(server).get('/sells').expect(200);
  });
});
