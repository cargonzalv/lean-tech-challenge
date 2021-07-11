require('dotenv').config();
import 'reflect-metadata';
import {ConfigServerType} from './types/';
import SERVER from './server';
const {env: ENV} = process;
const {exec} = require('child_process');

process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException',  (err) => console.error(err.stack || err));
process.on('exit', () => exec('docker compose stop'));


class Services {
  public static server = () => {

    let CONFIG:ConfigServerType = {
      port: (ENV.PORT ? +ENV.PORT : 3000),
      mongo_uri: ENV.MONGO_URI || 'mongodb://localhost:27017/leantech'
    };
  
    const Server = new SERVER(CONFIG);
    return Server.initiate().listen();
  };
};

export default Services.server();