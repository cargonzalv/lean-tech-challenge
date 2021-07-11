import { ModifiedContext } from '../types';

export default class IndexController {

    public static async getIndex(ctx: ModifiedContext) {
        ctx.status = 200;
    }
}
