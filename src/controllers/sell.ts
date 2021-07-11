import { ModifiedContext, Responses } from '../types';

import SellModel, { SellDocument, SellType } from '../models/sell';
/**
 * @param fecha - A valid Date that has already been validated by JOI
 * @param cantidad - A valid number that has already been validated by JOI
 * @param idProducto - A valid number that has already been validated by JOI
 * @param nombreProducto - A valid string that has already been validated by JOI
 */
type InputCreateBodyType = { fecha: Date; cantidad: number; idProducto: number; nombreProducto: string };

class SellController {
  public static create = async (ctx: ModifiedContext) => {
    const body: InputCreateBodyType = ctx.request.body;
    const createUser: SellDocument | null = await SellModel.create(body).catch((err) => null);

    if (createUser) {
      const response: SellType = createUser.toNormalization();
      ctx.status;
      return ctx.send(201, response);
    } else {
      return ctx.send(400, Responses.CANT_CREATE_SELL);
    }
  };

  public static read = async (ctx: ModifiedContext) => {
    const sell: SellDocument | null = await SellModel.findById(ctx.request.params.id);

    if (sell) {
      const response: SellType = sell.toNormalization();
      return ctx.send(200, response);
    } else {
      return ctx.send(400, Responses.OBJECT_NOT_FOUND);
    }
  };

  public static getAll = async (ctx: ModifiedContext) => {
    const sells: SellDocument[] | null = await SellModel.find();

    if (sells) {
      const response: SellType[] = sells.map((p) => p.toNormalization());
      return ctx.send(200, response);
    } else {
      return ctx.send(400, Responses.SOMETHING_WENT_WRONG);
    }
  };
}

export default SellController;
