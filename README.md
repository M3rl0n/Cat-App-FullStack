# 🐱 Cat Explorer - Fullstack Application

Aplicación web fullstack para explorar razas de gatos usando The Cat API, construida con Angular, Node.js, Express y MongoDB.

## 🛠️ Tecnologías

- **Frontend**: Angular 17, Bootstrap 5, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Base de datos**: MongoDB Atlas
- **API externa**: The Cat API

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en MongoDB Atlas (opcional, ya configurada)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/cat-app-fullstack.git
cd cat-app-fullstack
```

### 2. Backend
```bash
cd cat-backend
npm install
npm run dev
```
El backend correrá en `http://localhost:3000`

### 3. Frontend
```bash
cd ../cat-frontend
npm install
ng serve
```
El frontend correrá en `http://localhost:4200`

## ✨ Funcionalidades

### 🎯 Principales
- **Explorador de razas**: Selector con carrusel de imágenes
- **Tabla de razas**: Vista completa con filtros de búsqueda
- **Autenticación**: Login y registro de usuarios
- **Perfil protegido**: Dashboard del usuario autenticado

### 🔧 Técnicas
- Diseño responsive con Bootstrap
- Integración con The Cat API
- Base de datos MongoDB Atlas
- Manejo de errores robusto

## 📱 Uso

1. Abre `http://localhost:4200`
2. Explora razas sin necesidad de registro
3. Regístrate para acceder al perfil protegido
4. Usa los filtros para buscar razas específicas

## 🌐 API Endpoints

```
GET  /api/gatos/breeds           - Todas las razas
GET  /api/gatos/breeds/:id       - Raza específica
GET  /api/gatos/search           - Búsqueda de razas
GET  /api/imagenes/imagesbybreedid - Imágenes por raza
POST /api/usuarios/register      - Registro de usuario
POST /api/usuarios/login         - Login de usuario
```

## 📁 Estructura

```
cat-app-fullstack/
├── cat-backend/          # API Node.js + Express
│   ├── src/
│   │   ├── controllers/  # Controladores REST
│   │   ├── services/     # Lógica de negocio
│   │   ├── models/       # Modelos MongoDB
│   │   └── routes/       # Rutas de la API
│   └── package.json
├── cat-frontend/         # App Angular
│   ├── src/app/
│   │   ├── core/         # Servicios y guards
│   │   ├── features/     # Componentes funcionales
│   │   └── shared/       # Componentes compartidos
│   └── package.json
└── README.md
```
