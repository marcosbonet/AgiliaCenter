import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  try {
    const verified = jwt.verify(
      token,
      process.env.TOKEN_SECRET || ""
    ) as JwtPayload; // Asegúrate de que sea de tipo JwtPayload
    req.user = {
      id: verified.id,
      nickname: verified.nickname,
      email: verified.email,
    }; // Asigna las propiedades que necesitas
    next(); // Continuar con la solicitud
  } catch (error) {
    res.status(400).json({ message: "Token no válido" });
  }
};
