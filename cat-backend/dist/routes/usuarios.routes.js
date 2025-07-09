"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_controller_1 = require("../controllers/usuarios.controller");
const router = (0, express_1.Router)();
// POST /api/usuarios/register - Registrar usuario
router.post('/register', usuarios_controller_1.register);
// POST /api/usuarios/login - Login usuario
router.post('/login', usuarios_controller_1.login);
exports.default = router;
