import { RequestHandler } from "express";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpValidation, signinValidation } from "../libs/joi";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { error } = signUpValidation(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const { nickname, nombre, apellido, direccion, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "El correo electrónico ya está en uso" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nickname,
      nombre,
      apellido,
      direccion,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(200).json({
      message: "Usuario registrado correctamente",
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const signin: RequestHandler = async (req, res, next) => {
  try {
    const { error } = signinValidation(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    const token: string = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET || "",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      profile: {
        nickname: user.nickname,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        direccion: user.direccion,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const profile: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res.status(401).json({ message: "Acceso denegado" });
      return;
    }

    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRET || ""
    ) as jwt.JwtPayload;
    if (!payload.id) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    const user = await User.findById(payload.id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json({
      nickname: user.nickname,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      direccion: user.direccion,
    });
  } catch (error) {
    next(error);
  }
};

export const unsubscribe: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res.status(401).json({ message: "Acceso denegado" });
      return;
    }

    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRET || ""
    ) as jwt.JwtPayload;
    if (!payload.id) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(payload.id);

    if (!deletedUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
