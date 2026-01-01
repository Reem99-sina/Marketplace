import jwt from "jsonwebtoken";
import "dotenv/config";

export const createToken = ({ id }: { id: string }) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET || "welcome", {
    expiresIn: "1d",
  });
};

export const auth = ({ verifyToken }: { verifyToken: string }) => {
  return jwt.verify(verifyToken, process.env.JWT_SECRET || "welcome");
};
