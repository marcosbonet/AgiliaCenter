import request from "supertest";
import express from "express";
import mongoose from "mongoose";

import User from "../models/Users";
import {
  register,
  signin,
  profile,
  unsubscribe,
} from "../controllers/user.controllers";

const app = express();
app.use(express.json()); // Para manejar solicitudes JSON

// Rutas de prueba
app.post("/api/register", register);
app.post("/api/signin", signin);
app.get("/api/profile", profile);
app.delete("/api/unsubscribe", unsubscribe);

// Conexión a la base de datos de prueba
beforeAll(async () => {
  await mongoose.connect(
    process.env.TEST_DATABASE_URL || "mongodb://localhost/test",
    {}
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Controller Tests", () => {
  // Limpia la base de datos antes de cada prueba
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("Registro de usuario exitoso", async () => {
    const response = await request(app).post("/api/register").send({
      nickname: "testuser",
      nombre: "Test",
      apellido: "User",
      direccion: "123 Test St",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Usuario registrado correctamente");
    expect(response.body.user).toHaveProperty("email", "test@example.com");
  });

  test("Registro de usuario con email existente", async () => {
    await request(app).post("/api/register").send({
      nickname: "testuser",
      nombre: "Test",
      apellido: "User",
      direccion: "123 Test St",
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/register").send({
      nickname: "anotheruser",
      nombre: "Another",
      apellido: "User",
      direccion: "456 Another St",
      email: "test@example.com",
      password: "password456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El correo electrónico ya está en uso");
  });

  test("Inicio de sesión exitoso", async () => {
    await request(app).post("/api/register").send({
      nickname: "testuser",
      nombre: "Test",
      apellido: "User",
      direccion: "123 Test St",
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/signin").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.profile).toHaveProperty("nickname", "testuser");
  });

  test("Obtener perfil de usuario", async () => {
    const registerResponse = await request(app).post("/api/register").send({
      nickname: "testuser",
      nombre: "Test",
      apellido: "User",
      direccion: "123 Test St",
      email: "test@example.com",
      password: "password123",
    });

    const token = registerResponse.body.token;

    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("nickname", "testuser");
  });

  test("Eliminar usuario", async () => {
    const registerResponse = await request(app).post("/api/register").send({
      nickname: "testuser",
      nombre: "Test",
      apellido: "User",
      direccion: "123 Test St",
      email: "test@example.com",
      password: "password123",
    });

    const token = registerResponse.body.token;

    const response = await request(app)
      .delete("/api/unsubscribe")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Usuario eliminado correctamente");

    const deletedUser = await User.findOne({ email: "test@example.com" });
    expect(deletedUser).toBeNull(); // Verifica que el usuario fue eliminado
  });
});
