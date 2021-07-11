import { ModifiedContext, Responses } from './../types';

import PurchaseModel, { PurchaseDocument, PurchaseType } from './../models/purchase';
/**
 * @param fecha - A valid Date that has already been validated by JOI
 * @param cantidad - A valid number that has already been validated by JOI
 * @param idProducto - A valid number that has already been validated by JOI
 * @param nombreProducto - A valid string that has already been validated by JOI
 */
type InputCreateBodyType = { fecha: Date; cantidad: number; idProducto: number; nombreProducto: string };

class PurchaseController {
  public static create = async (ctx: ModifiedContext) => {
    const body: InputCreateBodyType = ctx.request.body;
    const createUser: PurchaseDocument | null = await PurchaseModel.create(body).catch((err) => null);

    if (createUser) {
      const response: PurchaseType = createUser.toNormalization();
      ctx.status;
      return ctx.send(201, response);
    } else {
      return ctx.send(400, Responses.CANT_CREATE_PURCHASE);
    }
  };

  public static read = async (ctx: ModifiedContext) => {
    const purchase: PurchaseDocument | null = await PurchaseModel.findById(ctx.request.params.id);

    if (purchase) {
      const response: PurchaseType = purchase.toNormalization();
      return ctx.send(200, response);
    } else {
      return ctx.send(400, Responses.OBJECT_NOT_FOUND);
    }
  };

  public static getAll = async (ctx: ModifiedContext) => {
    const purchases: PurchaseDocument[] | null = await PurchaseModel.find();

    if (purchases) {
      const response: PurchaseType[] = purchases.map((p) => p.toNormalization());
      return ctx.send(200, response);
    } else {
      return ctx.send(400, Responses.SOMETHING_WENT_WRONG);
    }
  };

  public static findByProduct = async (ctx: ModifiedContext) => {
    const purchase: PurchaseDocument | null = await PurchaseModel.findOne({ product: ctx.request.params.productId });

    if (purchase) {
      const response: PurchaseType = purchase.toNormalization();
      return ctx.send(200, response);
    } else {
      return ctx.send(400, Responses.OBJECT_NOT_FOUND);
    }
  };
}

export default PurchaseController;
