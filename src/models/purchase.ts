import mongoose from 'mongoose';

/**
 * @param fecha - A valid Date that has already been validated by JOI
 * @param cantidad - A valid number that has already been validated by JOI
 * @param idProducto - A valid number that has already been validated by JOI
 * @param nombreProducto - A valid string that has already been validated by JOI
 */
export type InputCreateBodyType = { fecha: Date; cantidad: number; idProducto: number; nombreProducto: string };

type toNormalizationFunction = () => PurchaseType;

export type PurchaseDocument = mongoose.Document & {
  fecha: Date;
  cantidad: number;
  idProducto: number;
  nombreProducto: string;
  toNormalization: toNormalizationFunction;
};

export type PurchaseType = {
  id: string | null;
  fecha: Date;
  cantidad: number;
  idProducto: number;
  nombreProducto: string;
};

const purchaseSchema = new mongoose.Schema(
  {
    fecha: { type: Date },
    cantidad: { type: Number },
    idProducto: { type: Number },
    nombreProducto: { type: String },
  },
  { timestamps: false },
);

const toNormalization: toNormalizationFunction = function () {
  const _purchaseObject: PurchaseDocument = this.toObject();

  const PurchaseObject: PurchaseType = {
    id: _purchaseObject._id.toString(),
    fecha: _purchaseObject.fecha,
    cantidad: _purchaseObject.cantidad,
    idProducto: _purchaseObject.idProducto,
    nombreProducto: _purchaseObject.nombreProducto,
  };

  return PurchaseObject;
};

purchaseSchema.methods.toNormalization = toNormalization;

const Purchase = mongoose.model<PurchaseDocument>('Purchase', purchaseSchema);
export default Purchase;
