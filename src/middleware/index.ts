/* eslint-disable @typescript-eslint/ban-types */
import { Middleware as KoaMiddleware } from 'koa';
import { ModifiedContext, Responses } from './../types/';

/**
 * @param secret - The JWT Secret
 * @returns Returns a function for Koa middleware injection
 */

class Middleware {
  public static send: KoaMiddleware = async (ctx: ModifiedContext, next: Function) => {
    /**
     * @param status - The http code
     * @param body - An Object or string input depending on the http code
     */
    ctx.send = (status: number, body: object | string, detail?: string) => {
      ctx.status = status;
      let error = false;

      if (status >= 299 || status < 200) {
        error = true;
      }

      if (error === true) {
        ctx.body = {
          code: ctx.status,
          error: { message: body, detail },
        };
      } else {
        ctx.body = {
          code: ctx.status,
          data: body,
        };
      }

      return ctx;
    };

    await next();
  };

  public static onError: KoaMiddleware = async (ctx: ModifiedContext, next: Function) => {
    try {
      await next();
    } catch (err) {
      console.error(err.stack || err);
      let message = Responses.INTERNAL_ERROR;
      if (err._original && Array.isArray(err._original)) {
        message = err._original?.map((valErr) => "'" + valErr.message.replace(/"\s/g, "' ").slice(1)).join(', ');
      }
      ctx.send(500, message);
    }
  };
}

export default Middleware;
