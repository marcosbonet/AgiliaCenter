import * as express from "express";
import { IUser } from "../models/Users";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, "id" | "nickname" | "email">;
    }
  }
}
