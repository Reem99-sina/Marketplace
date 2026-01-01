import mongoose, { Schema, Document, Types } from "mongoose";
import { StoreDoc } from "./Store";
import { OrderItemDoc } from "./OrderItem";
import { UserDoc } from "./User";
import { ProductDoc } from "./Product";

export interface OrderDoc extends Document {
  storeId: Types.ObjectId | string|StoreDoc;
  store: StoreDoc;
  orderItems: Types.ObjectId[] | OrderItemDoc[];
  isPaid: boolean;
  phone: string;
  address: string;
  userId?: Types.ObjectId | string;
  user?: UserDoc;
  createdAt: Date;
  updatedAt: Date;
  commission: number; // Commission added here
}

const orderSchema = new Schema<OrderDoc>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store" },
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    isPaid: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    commission: { type: Number, default: 0 }, // Commission added here
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model<OrderDoc>("Order", orderSchema);

export interface OrderItemPopulated extends Omit<OrderItemDoc, "productId"> {
  productId: ProductDoc; // populated product
}

export interface OrderPopulated {
  _id: Types.ObjectId;
  storeId: StoreDoc; // fully populated
  userId?: UserDoc;  // fully populated
  orderItems: OrderItemPopulated[];
  isPaid: boolean;
  phone: string;
  address: string;
  commission: number;
  createdAt: Date;
  updatedAt: Date;
}
