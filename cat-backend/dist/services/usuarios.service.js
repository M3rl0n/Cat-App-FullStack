"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class UsuariosService {
    async register(userData) {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await User_1.default.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }
            // Crear nuevo usuario (en producción deberías hashear la contraseña)
            const newUser = new User_1.default(userData);
            const savedUser = await newUser.save();
            // Retornar usuario sin contraseña
            return {
                id: savedUser._id.toString(),
                email: savedUser.email,
                name: savedUser.name,
                createdAt: savedUser.createdAt
            };
        }
        catch (error) {
            console.error('Error registrando usuario:', error);
            throw error;
        }
    }
    async login(loginData) {
        try {
            // Buscar usuario por email
            const user = await User_1.default.findOne({ email: loginData.email });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            // Verificar contraseña (en producción deberías usar bcrypt)
            if (user.password !== loginData.password) {
                throw new Error('Contraseña incorrecta');
            }
            // Retornar usuario sin contraseña
            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            };
        }
        catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }
}
exports.default = new UsuariosService();
