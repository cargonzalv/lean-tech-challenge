import { ModifiedContext } from '../types';

export default class IndexController {
  public static async getIndex(ctx: ModifiedContext) {
    return ctx.send(200, '');
  }
}
