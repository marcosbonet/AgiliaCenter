import User, { IUser } from "../models/Users";
import { CreateUserDTO } from "../dtos/user.dto";

export class UserService {
  // Crear un usuario
  async createUser(data: CreateUserDTO): Promise<IUser> {
    try {
      const user = new User(data); // Crear el nuevo usuario
      return await user.save(); // Guardar el usuario en la base de datos
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error}`);
    }
  }

  // Crear varios usuarios al mismo tiempo
  async createManyUsers(users: CreateUserDTO[]): Promise<IUser[]> {
    try {
      return await User.insertMany(users);
    } catch (error) {
      throw new Error(`Error al crear usuarios: ${error}`);
    }
  }
  // Obtener todos los usuarios
  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find(); // Obtener todos los usuarios
    } catch (error) {
      throw new Error(`Error al obtener los usuarios: ${error}`);
    }
  }

  // Obtener un usuario por ID
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId); // Buscar usuario por ID
    } catch (error) {
      throw new Error(`Error al obtener el usuario: ${error}`);
    }
  }
  async deleteUser(userId: string): Promise<void> {
    try {
      await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error}`);
    }
  }
}
