import mongoose from "mongoose";

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/logindatabase")
  .then(() => console.log("Conexión a MongoDB establecida"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));
