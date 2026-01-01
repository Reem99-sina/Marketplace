import mongoose, { Schema, Document, Types } from "mongoose";
import { OrderDoc } from "./Order";
import { ProductDoc } from "./Product";

export interface OrderItemDoc extends Document {
  orderId: Types.ObjectId | string;
  order: OrderDoc;
  productId: Types.ObjectId | string;
  product: ProductDoc;
  quantity: number;
  price: number;
}

const orderItemSchema = new Schema<OrderItemDoc>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // price per unit
});

export const OrderItem =
  mongoose.models.OrderItem ||
  mongoose.model<OrderItemDoc>("OrderItem", orderItemSchema);
