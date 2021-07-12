import { ModifiedContext, Responses } from '../types';

import SellModel, { SellDocument, SellType, InputCreateBodyType } from '../models/sell';
import PurchaseController from './purchase';

class SellController {
  public static create = async (ctx: ModifiedContext) => {
    let errorMessage: string = Responses.CANT_CREATE_SELL;
    const productId = ctx.request.body.idProducto;
    const body: InputCreateBodyType = ctx.request.body;
    const purchases = await PurchaseController.findByProduct(productId, body.fecha);
    const totalInventory = purchases.reduce((accum, p) => (accum += p.cantidad), 0);
    //We make sure we have sufficient total purchase orders to be able to sell them
    if (purchases && totalInventory >= body.cantidad) {
      let processedSells = 0;
      // We loop through all possible purchase orders, from oldest to newest (FIFO) and process them
      for (let i = 0; i < purchases.length && body.cantidad > processedSells; i++) {
        const purchase = purchases[i];
        const remainingSells = body.cantidad - processedSells;
        const quantityToProcess = purchase.cantidad >= remainingSells ? remainingSells : purchase.cantidad;
        const update = await PurchaseController.updatePurchase(purchase.id, {
          ...purchase,
          cantidad: purchase.cantidad - quantityToProcess,
        });
        if (!update) {
          errorMessage = "Can't update the purchase";
          return ctx.send(400, errorMessage);
        }
        processedSells += quantityToProcess;
      }
      const createSell: SellDocument | null = await SellModel.create(body).catch(() => null);
      if (createSell) {
        const response: SellType = createSell.toNormalization();
        return ctx.send(201, response);
      }
    } else {
      errorMessage = 'Sell exceeds current inventory for this product';
    }
    return ctx.send(400, errorMessage);
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
