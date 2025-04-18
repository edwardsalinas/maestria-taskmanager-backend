// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');
const authMiddleware = require('./middleware/auth.middleware');

// Configuración inicial
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: [
    'https://maestria-taskmanager-frontend.vercel.app', // Producción
    /https:\/\/maestria-taskmanager-frontend-.*-edward-salinas-projects\.vercel\.app/, // Previews
    'https://majestic-muffin-464472.netlify.app',
    'http://localhost:5173' // Desarrollo local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Middleware de autenticación para rutas privadas
app.use(authMiddleware);

// Rutas privadas
app.use('/api/tasks', taskRoutes);

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.send('API de Gestión de Tareas funcionando 🚀');
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo salió mal en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`MongoDB connected`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});