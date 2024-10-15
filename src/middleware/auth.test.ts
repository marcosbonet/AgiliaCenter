import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth";

const app = express();
app.use(express.json()); // Para manejar solicitudes JSON

// Crear una ruta de prueba que use el middleware
app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Acceso permitido", user: req.user });
});

// Mockear el TOKEN_SECRET para pruebas
process.env.TOKEN_SECRET = "mysecret";

// Pruebas del middleware
describe("verifyToken Middleware Tests", () => {
  test("Debería permitir acceso con token válido", async () => {
    const token = jwt.sign(
      { id: "123", nickname: "testuser", email: "test@example.com" },
      process.env.TOKEN_SECRET || "",
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Acceso permitido",
      user: {
        id: "123",
        nickname: "testuser",
        email: "test@example.com",
      },
    });
  });

  test("Debería denegar el acceso sin token", async () => {
    const response = await request(app).get("/api/protected");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Acceso denegado" });
  });

  test("Debería denegar el acceso con token no válido", async () => {
    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", "invalidtoken");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Token no válido" });
  });
});
