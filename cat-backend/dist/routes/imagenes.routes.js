"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imagenes_controller_1 = require("../controllers/imagenes.controller");
const router = (0, express_1.Router)();
// GET /api/imagenes/imagesbybreedid - Obtener imágenes por raza
router.get('/imagesbybreedid', imagenes_controller_1.getImagesByBreedId);
exports.default = router;
