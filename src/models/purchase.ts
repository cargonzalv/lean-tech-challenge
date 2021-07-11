import mongoose from 'mongoose';

type toNormalizationFunction = () => PurchaseType;

export type PurchaseDocument = mongoose.Document & {
    fecha: Date,
    cantidad: number,
    idProducto: number,
    nombreProducto: string,
    toNormalization: toNormalizationFunction
};

export type PurchaseType = {
    id: string | null;
    fecha: Date,
    cantidad: number,
    idProducto: number,
    nombreProducto: string
};

const purchaseSchema = new mongoose.Schema({
    fecha: { type: Date },
    cantidad: { type: Number },
    idProducto: { type: Number },
    nombreProducto: { type: String }
}, { timestamps: false });

const toNormalization: toNormalizationFunction = function () {
    let _purchaseObject: PurchaseDocument = this.toObject();

    let PurchaseObject: PurchaseType = {
        id: _purchaseObject._id.toString(),
        fecha: _purchaseObject.fecha,
        cantidad: _purchaseObject.cantidad,
        idProducto: _purchaseObject.idProducto,
        nombreProducto: _purchaseObject.nombreProducto
    };

    return PurchaseObject;
};

purchaseSchema.methods.toNormalization = toNormalization;

const Purchase = mongoose.model<PurchaseDocument>('Purchase', purchaseSchema);

export default Purchase;