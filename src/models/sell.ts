import mongoose from 'mongoose';

/**
 * @param fecha - A valid Date that has already been validated by JOI
 * @param cantidad - A valid number that has already been validated by JOI
 * @param idProducto - A valid number that has already been validated by JOI
 * @param nombreProducto - A valid string that has already been validated by JOI
 */
export type InputCreateBodyType = { fecha: Date; cantidad: number; idProducto: number; nombreProducto: string };

type toNormalizationFunction = () => SellType;

export type SellDocument = mongoose.Document & {
  fecha: Date;
  cantidad: number;
  idProducto: number;
  nombreProducto: string;
  toNormalization: toNormalizationFunction;
};

export type SellType = {
  id: string | null;
  fecha: Date;
  cantidad: number;
  idProducto: number;
  nombreProducto: string;
};

const sellSchema = new mongoose.Schema(
  {
    fecha: { type: Date },
    cantidad: { type: Number },
    idProducto: { type: Number },
    nombreProducto: { type: String },
  },
  { timestamps: false },
);

const toNormalization: toNormalizationFunction = function () {
  const _sellObject: SellDocument = this.toObject();

  const SellObject: SellType = {
    id: _sellObject._id.toString(),
    fecha: _sellObject.fecha,
    cantidad: _sellObject.cantidad,
    idProducto: _sellObject.idProducto,
    nombreProducto: _sellObject.nombreProducto,
  };

  return SellObject;
};

sellSchema.methods.toNormalization = toNormalization;

const Sell = mongoose.model<SellDocument>('Sell', sellSchema);

export default Sell;
