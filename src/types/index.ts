import { Context } from 'koa';

/**
 * @remarks
 * This method is part of the Server Config.
 *
 * @param port - A Port to run the server on
 * @param mongo_uri - The mongo uri mongo://127.0.0.1:27017/test
*/
type ConfigServerType        = { port: number, mongo_uri: string };
/**
 * @remarks
 * Response options
*/
enum Responses {
  NOT_FOUND            = 'Not Found',
  CANT_CREATE_PURCHASE = 'Unable to create purchase',
  CANT_CREATE_SELL     = 'Unable to create sell',
  INTERNAL_ERROR       = 'An internal server has error occured',
  SOMETHING_WENT_WRONG = 'Something went wrong',
  OBJECT_NOT_FOUND     = 'Object was not found'
}

/**
 * @remarks
 * Extends the base context with send
*/
interface ModifiedContext extends Context {
  send: (status: number, body: object|string) => ModifiedContext
}

export {
  ConfigServerType,
  Responses,
  ModifiedContext
};
