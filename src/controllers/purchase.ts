import { ModifiedContext, Responses } from './../types';

import PurchaseModel, { PurchaseDocument, PurchaseType, InputCreateBodyType } from './../models/purchase';

class PurchaseController {
  public static create = async (ctx: ModifiedContext) => {
    const body: InputCreateBodyType = ctx.request.body;
    const createPurchase: PurchaseDocument | null = await PurchaseModel.create(body).catch(() => null);

    if (createPurchase) {
      const response: PurchaseType = createPurchase.toNormalization();
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

  public static findByProduct = async (productId: number, fecha: Date) => {
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
  };

  public static updatePurchase = async (purchaseId: string, newPurchase: InputCreateBodyType) => {
    try {
      const updatePurchase: PurchaseDocument | null = await PurchaseModel.findByIdAndUpdate(purchaseId, newPurchase, {
        useFindAndModify: false,
      });

      const response: PurchaseType = updatePurchase?.toNormalization();
      return response;
    } catch (err) {
      return null;
    }
  };
}

export default PurchaseController;
