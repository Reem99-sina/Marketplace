import { UserDoc } from "@/models/User";

export type RegisterResponseData = {
  token: string;
};

export type ResponseMessage = {
  message: string;
} | null;

export type LoginResponseData={
  user:UserDoc
}|null