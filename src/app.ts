require('dotenv').config();
import 'reflect-metadata';
import { ConfigServerType } from './types/';
import SERVER from './server';
const { env: ENV } = process;
const { exec } = require('child_process');

process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException', (err) => console.error(err.stack || err));
['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => process.on(signal, () => {}));
// process.on('SIGINT', () => {
//   exec('docker compose stop', () => {
//     process.exit(1);
//   })
// });

class Services {
  public static server = () => {
    const CONFIG: ConfigServerType = {
      port: ENV.PORT ? +ENV.PORT : 3000,
      mongo_uri: ENV.MONGO_URI || 'mongodb://localhost:27017/leantech',
    };

    const Server = new SERVER(CONFIG);
    return Server.initiate().listen();
  };
}

export default Services.server();
