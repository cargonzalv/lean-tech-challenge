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
    let detail = '';
    const createPurchase: PurchaseDocument | null = await PurchaseModel.create(body).catch((err) => {
      if (err.stack) {
        console.error(err.stack);
        detail = err.stack.split('\n')[0];
      }
      return null;
    });

    if (createPurchase) {
      const response: PurchaseType = createPurchase.toNormalization();
      return ctx.send(201, response);
    } else {
      return ctx.send(400, Responses.CANT_CREATE_PURCHASE, detail);
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

  public static findByProduct = async (productId: number, fecha: Date) => {
    try {
      const purchase = await PurchaseModel.find({
        idProducto: productId,
        fecha: {
          $lte: fecha, // We just care about purchase orders registered before or on the sell order date
        },
        cantidad: {
          $gte: 0,
        },
      }).sort({ fecha: 1 });
      const response: PurchaseType[] = purchase?.map((p) => p.toNormalization());
      return response;
    } catch (err) {
      return null;
    }
  };

  public static updatePurchase = async (purchaseId: string, newPurchase: InputCreateBodyType) => {
    const updatePurchase: PurchaseDocument | null = await PurchaseModel.findByIdAndUpdate(
      purchaseId,
      newPurchase,
    ).catch((err) => {
      console.error(err);
      return null;
    });

    console.log(updatePurchase);

    const response: PurchaseType = updatePurchase?.toNormalization();
    return response;
  };
}

export default PurchaseController;
