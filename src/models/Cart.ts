import mongoose, { Schema, Document, Types } from "mongoose";
import { ProductDoc } from "./Product";

export interface CartItem {
  product: Types.ObjectId | ProductDoc;
  quantity: number;
}

export interface CartDoc extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<CartDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reload in dev
export const Cart =
  mongoose.models.Cart || mongoose.model<CartDoc>("Cart", CartSchema);

export interface CartItemPopulated extends Omit<CartItem, "product"> {
  product: ProductDoc; // populated product
}

// Populated Cart
export interface CartPopulated extends Omit<CartDoc, "items"> {
  items: CartItemPopulated[];
}
