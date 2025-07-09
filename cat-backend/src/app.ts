import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import gatosRoutes from './routes/gatos.routes';
import imagenesRoutes from './routes/imagenes.routes';
import usuariosRoutes from './routes/usuarios.routes';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Eventos de MongoDB para monitoreo
mongoose.connection.on('connected', () => {
  console.log('MongoDB Atlas: Conexión establecida');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Atlas: Error de conexión:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Atlas: Conexión perdida');
});

// Manejo graceful del cierre de la aplicación
process.on('SIGINT', async () => {
  console.log('\n Cerrando conexión a MongoDB Atlas...');
  await mongoose.connection.close();
  console.log('Conexión a MongoDB Atlas cerrada.');
  process.exit(0);
});

// Conexión a MongoDB Atlas
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI no está configurada en las variables de entorno');
    }

    console.log('Conectando a MongoDB Atlas...');
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('Conectado exitosamente a MongoDB Atlas');
  } catch (error) {
    console.error('Error conectando a MongoDB Atlas:', {
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    process.exit(1);
  }
};

// Inicializar conexión a base de datos
connectDB();

// Rutas
app.use('/api/gatos', gatosRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Cat API Backend funcionando! ' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
