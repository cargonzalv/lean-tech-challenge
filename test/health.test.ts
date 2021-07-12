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
});

describe('GET /health', () => {
  it('should return microservice health', () => {
    return request(server).get('/health').expect(200);
  });
});
