import mongoose, { Schema, Document, Types } from "mongoose";
import { StoreDoc } from "./Store";
import { OrderItemDoc } from "./OrderItem";

export interface ProductDoc extends Document {
  storeId: Types.ObjectId | string;
  store: StoreDoc;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  orderItems: Types.ObjectId[] | OrderItemDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDoc>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store" },
    name: { type: String, required: true },
    price: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product ||
  mongoose.model<ProductDoc>("Product", productSchema);
