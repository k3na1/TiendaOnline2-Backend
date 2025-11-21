const express = require('express');
const cors = require('cors');
const app = express();

// 1. Configuración Básica
app.use(cors());
app.use(express.json()); // Permite recibir JSON en los POST

// 2. Importar Rutas
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// 3. Usar Rutas
// Todas las rutas de usuario empezarán con "/api/users"
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// 4. Iniciar Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Prueba tus usuarios en: http://localhost:${PORT}/api/users`);
});