import {version} from './../../package.json';
import { ModifiedContext } from '../types';

enum STATUS {
  PASS = 'pass',
  FAIL = 'fail',
  WARN = 'warn',
}
  
class Health {
  public static read = async (ctx: ModifiedContext) => {
    return ctx.send(200, {
      status: STATUS.PASS,
      version,
      timestamp: (new Date()).toISOString(),
      uptime: process.uptime()
    });
  };
}

export default Health;
