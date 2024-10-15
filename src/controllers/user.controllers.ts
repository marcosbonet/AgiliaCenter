import { Request, Response } from "express";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpValidation, signinValidation } from "../libs/joi";

// Registro de usuario

async function register(req: Request, res: Response): Promise<Response> {
  const { error } = signUpValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { nickname, nombre, apellido, direccion, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
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
    return res.status(200).json({
      message: "Usuario registrado correctamente",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
  }
}

// Inicio de sesión
async function signin(req: Request, res: Response): Promise<Response> {
  // Validar los datos de entrada con Joi
  const { error } = signinValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token: string = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET || "",
      { expiresIn: "1h" } // Token expira en 1 hora
    );

    // Retornar el token y los datos del perfil
    return res.json({
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
    console.error("Error durante el inicio de sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Obtener perfil de usuario
async function profile(req: Request, res: Response): Promise<Response> {
  try {
    // Obtener el token del encabezado Authorization
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Acceso denegado" });

    // Verificar el token
    const payload = jwt.verify(token, process.env["TOKEN_SECRET"] || "");
    if (!payload)
      return res.status(404).json({ message: "Autenticación requerida" });

    // Buscar al usuario por ID
    const user = await User.findById((payload as any).id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Retornar los datos del perfil
    return res.json({
      nickname: user.nickname,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      direccion: user.direccion,
    });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function unsubscribe(req: Request, res: Response): Promise<Response> {
  try {
    // Obtener el token del encabezado Authorization
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado" });
    }

    // Verificar el token
    const payload = jwt.verify(token, process.env.TOKEN_SECRET || "");

    // Buscar al usuario por ID y eliminarlo
    const userId = (payload as any).id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
export default {
  register,
  signin,
  profile,
  unsubscribe,
};
