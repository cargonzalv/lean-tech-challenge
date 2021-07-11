import { Context } from 'koa';

/**
 * @remarks
 * This method is part of the Server Config.
 *
 * @param port - A Port to run the server on
 * @param mongo_uri - The mongo uri mongo://127.0.0.1:27017/test
*/
type ConfigServerType    = { port: number, mongo_uri: string };

type PurchaseStateType       = { id: string };

/**
 * @remarks
 * Extends ctx.state.user type to the base context
*/
type ConfigStateType     = {
  purchase: PurchaseStateType|null
};

/**
 * @remarks
 * Response options
*/
enum Responses {
  NOT_FOUND            = 'Not Found',
  CANT_CREATE_PURCHASE = 'Unable to create purchase',
  INTERNAL_ERROR       = 'An internal server has error occured',
  SOMETHING_WENT_WRONG = 'Something went wrong'
};

/**
 * @remarks
 * Extends the base context with KWT, Respond and State
*/
interface ModifiedContext extends Context {
  state: ConfigStateType
}

export {
  ConfigServerType,
  Responses,
  ModifiedContext
};
