import http from 'http';
import request from 'supertest';
import Server from './../src/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { InputCreateBodyType } from '../src/models/purchase';
import PurchaseModel from '../src/models/purchase';
import SellModel from '../src/models/sell';

let server: null | http.Server = null;
let mongoServer: MongoMemoryServer = null;
const findByIdAndUpdate = PurchaseModel.findByIdAndUpdate;
const create = SellModel.create;
const find = SellModel.find;

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
  PurchaseModel.findByIdAndUpdate = findByIdAndUpdate;
  SellModel.create = create;
  SellModel.find = find;
});

afterEach(() => {
  server?.close();
});

describe('POST /registrar-venta', () => {
  const obj: InputCreateBodyType = {
    fecha: new Date('2020-01-18'),
    cantidad: 5,
    idProducto: 1,
    nombreProducto: 'Calabaza',
  };
  it('should create a new sell', async () => {
    await request(server).post('/registrar-compra').send(obj); // We create a purchase first, then we try to create the sell
    return request(server).post('/registrar-venta').send(obj).expect(201);
  });
  it('should not create a new sell', () => {
    return request(server).post('/registrar-venta').send(obj).expect(400);
  });
  it('should not create a new sell because of update error', async () => {
    await request(server).post('/registrar-compra').send(obj); // We create a purchase first, then we try to create the sell
    PurchaseModel.findByIdAndUpdate = jest.fn().mockImplementation(() => {
      throw new Error('Error');
    });
    return request(server).post('/registrar-venta').send(obj).expect(400);
  });
  it('should handle DB error on creating new purchase', async () => {
    await request(server).post('/registrar-compra').send(obj); // We create a purchase first, then we try to create the sell
    SellModel.create = jest.fn().mockResolvedValue(null);
    const req = request(server)
      .post('/registrar-venta')
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

describe('GET /sells', () => {
  it('should return sells', () => {
    return request(server).get('/sells').expect(200);
  });
  it('should not return sells', () => {
    SellModel.find = jest.fn().mockResolvedValue(null);
    return request(server).get('/sells').expect(400);
  });
});

describe('GET /sell/:id', () => {
  it('should return a sell', async () => {
    const req = await request(server).post('/registrar-venta').send({
      fecha: '2020-01-18',
      cantidad: 5,
      idProducto: 1,
      nombreProducto: 'Calabaza',
    });
    return request(server).get(`/sell/${req.body.data.id}`).expect(200);
  });
  it('should not return a sell', async () => {
    return request(server).get(`/sell/60ea9fbd00ee50f6a0b55b04`).expect(400);
  });
  it('should not return a sell', async () => {
    return request(server).get(`/sell/123`).expect(500);
  });
});
