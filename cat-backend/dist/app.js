"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const gatos_routes_1 = __importDefault(require("./routes/gatos.routes"));
const imagenes_routes_1 = __importDefault(require("./routes/imagenes.routes"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
// Configuración de variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Conexión a MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((error) => console.error('❌ Error conectando a MongoDB:', error));
// Rutas
app.use('/api/gatos', gatos_routes_1.default);
app.use('/api/imagenes', imagenes_routes_1.default);
app.use('/api/usuarios', usuarios_routes_1.default);
// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Cat API Backend funcionando! 🐱' });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
