import mongoose, { Schema, Document, Types } from "mongoose";

import bcrypt from "bcrypt";
import { Role } from "./Role";
import { OrderDoc } from "./Order";

export interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  orders: Types.ObjectId[] | OrderDoc[];
  createdAt: Date;
  store?: Types.ObjectId;
}

const userSchema = new Schema<UserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.CUSTOMER },
  isActive: { type: Boolean, default: true },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now },
  store: { type: Schema.Types.ObjectId, ref: "Store", default: null },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};
export const User =
  mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);
