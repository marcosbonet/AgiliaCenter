import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/logindatabase", {});
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); // Salir si no se puede conectar
  }
};

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
