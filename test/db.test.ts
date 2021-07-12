import Server from './../src/server';
import MONGOOSE from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer = null;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
});

afterEach(async () => {
  await mongoServer.stop();
});

describe('DB connection', () => {
  it('should connect to DB successfully', async () => {
    jest.useFakeTimers();
    const uri = mongoServer.getUri();
    const instance = new Server({ mongo_uri: uri, port: getRandomInt(4000, 10000) });
    await instance.db();
    return expect(MONGOOSE.connection.readyState).toBe(1);
  });
  it('should not connect to DB successfuly', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const uri = mongoServer.getUri();
    const instance = new Server({ mongo_uri: uri + 'bug', port: getRandomInt(4000, 10000) });
    await instance.db();
    const exp = expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
    return exp;
  });
});
