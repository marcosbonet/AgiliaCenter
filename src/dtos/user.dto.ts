export interface CreateUserDTO {
  nickname: string;
  nombre?: string;
  apellido?: string;
  direccion: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  nickname?: string;
  direccion?: string;
  email?: string;
  password?: string;
}
