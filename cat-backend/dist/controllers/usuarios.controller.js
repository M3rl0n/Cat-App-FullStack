"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const usuarios_service_1 = __importDefault(require("../services/usuarios.service"));
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({
                error: 'Email, contraseña y nombre son requeridos'
            });
            return;
        }
        const user = await usuarios_service_1.default.register({ email, password, name });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({
            error: 'Error al registrar usuario',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: 'Email y contraseña son requeridos'
            });
            return;
        }
        const user = await usuarios_service_1.default.login({ email, password });
        res.json(user);
    }
    catch (error) {
        res.status(401).json({
            error: 'Error en autenticación',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.login = login;
