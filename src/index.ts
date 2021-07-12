import dotenv from 'dotenv';
import 'reflect-metadata';
import { ConfigServerType } from './types/';
import SERVER from './server';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { env: ENV } = process;

process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException', (err) => console.error(err.stack || err));

class Services {
  public static server = () => {
    const CONFIG: ConfigServerType = {
      port: ENV.PORT ? +ENV.PORT : 3000,
      mongo_uri: ENV.MONGO_URI || 'mongodb://mongodb:27017/leantech',
    };

    const Server = new SERVER(CONFIG);
    return Server.initiate().listen();
  };
}

export default Services.server();
