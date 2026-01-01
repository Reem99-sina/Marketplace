import mongoose, { Schema, Document, Types } from "mongoose";
import { ProductDoc } from "./Product";
import { OrderDoc } from "./Order";
import { UserDoc } from "./User";

export interface StoreDoc extends Document {
  name: string;
  orders: Types.ObjectId[] | OrderDoc[];
  products: Types.ObjectId[] | ProductDoc[];
  venderId: Types.ObjectId | UserDoc;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<StoreDoc>(
  {
    name: { type: String, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    venderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export const Store =
  mongoose.models.Store || mongoose.model<StoreDoc>("Store", storeSchema);
