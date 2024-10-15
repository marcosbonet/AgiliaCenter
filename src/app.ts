import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Función para conectar a MongoDB
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/logindatabase"
    );
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); // Salir si no se puede conectar
  }
};

// Middleware
app.use(express.json());
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Ruta de prueba
app.get("/", (req: Request, res: Response) => {
  res.send("API de autenticación funcionando");
});

// Iniciar el servidor
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Error al iniciar el servidor:", error);
  process.exit(1);
});
