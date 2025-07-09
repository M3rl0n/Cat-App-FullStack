import User, { IUser } from '../models/User';
import { CreateUserDto, LoginDto, UserResponseDto } from '../dto';

class UsuariosService {
  
  async register(userData: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      // Crear nuevo usuario
      const newUser = new User(userData);
      const savedUser = await newUser.save();

      // Retornar usuario sin contraseña
      return {
        id: (savedUser._id as any).toString(),
        email: savedUser.email,
        name: savedUser.name,
        createdAt: savedUser.createdAt
      };
    } catch (error) {
      console.error('Error registrando usuario:', error);
      throw error;
    }
  }

  async login(loginData: LoginDto): Promise<UserResponseDto> {
    try {
      // Buscar usuario por email
      const user = await User.findOne({ email: loginData.email });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña (en producción deberías usar bcrypt)
      if (user.password !== loginData.password) {
        throw new Error('Contraseña incorrecta');
      }

      // Retornar usuario sin contraseña
      return {
        id: (user._id as any).toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
}

export default new UsuariosService();
