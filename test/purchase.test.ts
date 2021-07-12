import http from 'http';
import request from 'supertest';
import Server from './../src/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import PurchaseModel from '../src/models/purchase';

let server: null | http.Server = null;
let mongoServer: MongoMemoryServer = null;
const create = PurchaseModel.create;
const find = PurchaseModel.find;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
});

beforeEach(() => {
  const uri = mongoServer.getUri();
  const instance = new Server({ mongo_uri: uri, port: getRandomInt(4000, 10000) });
  server = http.createServer(instance.initiate().listen().callback());
  PurchaseModel.create = create;
  PurchaseModel.find = find;
});

afterEach(() => {
  server?.close();
});

describe('POST /registrar-compra', () => {
  it('should create a new purchase', () => {
    return request(server)
      .post('/registrar-compra')
      .send({
        fecha: '2020-01-18',
        cantidad: 5,
        idProducto: 1,
        nombreProducto: 'Calabaza',
      })
      .expect(201);
  });
  it('should not create a new purchase. Param missing', () => {
    return request(server)
      .post('/registrar-compra')
      .send({
        fecha: '2020-01-18',
        cantidad: 2,
        nombreProducto: 'Calabaza',
      })
      .expect(500);
  });
  it('should not create a new purchase. Wrong param type', () => {
    return request(server)
      .post('/registrar-compra')
      .send({
        fecha: '2020-01-18',
        cantidad: 'hello',
        idProducto: 1,
        nombreProducto: 'Calabaza',
      })
      .expect(500);
  });
  it('should not create a new purchase', () => {
    return request(server).post('/registrar-compra').send(null).expect(500);
  });
  it('should handle DB error on creating new purchase', async () => {
    PurchaseModel.create = jest.fn().mockResolvedValue(null);
    const req = request(server)
      .post('/registrar-compra')
      .send({
        fecha: '2020-01-18',
        cantidad: 5,
        idProducto: 1,
        nombreProducto: 'Calabaza',
      })
      .expect(400);
    return req;
  });
});

describe('GET /purchases', () => {
  it('should return purchases', () => {
    return request(server).get('/purchases').expect(200);
  });
  it('should not return purchases', () => {
    PurchaseModel.find = jest.fn().mockResolvedValue(null);
    return request(server).get('/purchases').expect(400);
  });
});

describe('GET /purchase/:id', () => {
  it('should return a purchase', async () => {
    const req = await request(server).post('/registrar-compra').send({
      fecha: '2020-01-18',
      cantidad: 5,
      idProducto: 1,
      nombreProducto: 'Calabaza',
    });
    return request(server).get(`/purchase/${req.body.data.id}`).expect(200);
  });
  it('should not return a purchase', async () => {
    return request(server).get(`/purchase/60ea9fbd00ee50f6a0b55b04`).expect(400);
  });
  it('should not return a purchase', async () => {
    return request(server).get(`/purchase/123`).expect(500);
  });
});
