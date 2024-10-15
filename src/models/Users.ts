import mongoose, { Schema, Document } from "mongoose";

// Definir una interfaz para el documento de Usuario
export interface IUser extends Document {
  nickname: string;
  nombre?: string;
  apellido?: string;
  direccion: string;
  email: string;
  password: string;
}

// Definir el esquema del modelo
const UserSchema: Schema = new Schema({
  nickname: { type: String, required: true },
  nombre: { type: String },
  apellido: { type: String },
  direccion: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Exportar el modelo de Usuario
export default mongoose.model<IUser>("User", UserSchema);
