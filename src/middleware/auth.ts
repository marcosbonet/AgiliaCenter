import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/Users";

// Update AuthRequest to use Pick<IUser>
interface AuthRequest extends Request {
  user?: Pick<IUser, "id" | "nickname" | "email">;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Acceso denegado" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET || ""
    ) as jwt.JwtPayload;

    // Ensure that decoded contains the necessary properties
    if (
      typeof decoded.id !== "string" ||
      typeof decoded.nickname !== "string" ||
      typeof decoded.email !== "string"
    ) {
      throw new Error("Token payload is invalid");
    }

    req.user = {
      id: decoded.id,
      nickname: decoded.nickname,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Token no válido" });
    } else {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};

export type { AuthRequest };
