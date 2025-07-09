"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gatos_controller_1 = require("../controllers/gatos.controller");
const router = (0, express_1.Router)();
// GET /api/gatos/breeds - Obtener todas las razas
router.get('/breeds', gatos_controller_1.getBreeds);
// GET /api/gatos/search - Buscar razas
router.get('/search', gatos_controller_1.searchBreeds);
// GET /api/gatos/breeds/:breed_id - Obtener raza específica
router.get('/breeds/:breed_id', gatos_controller_1.getBreedById);
exports.default = router;
