import {version} from './../../package.json';
import { BaseContext } from 'koa';

enum STATUS {
  PASS = 'pass',
  FAIL = 'fail',
  WARN = 'warn',
}
  
class Health {
  public static read = async (ctx: BaseContext) => {
    ctx.status = 200;
    ctx.body = {
      status: STATUS.PASS,
      version,
      timestamp: (new Date()).toISOString(),
      uptime: process.uptime()
    }
  };
};

export default Health;
