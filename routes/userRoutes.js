const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD Completo
router.post('/', userController.createUser);      // Crear
router.get('/', userController.getAllUsers);      // Leer Todos
router.get('/:id', userController.getUserById);   // Leer Uno
router.put('/:id', userController.updateUser);    // Actualizar
router.put('/:id/role', userController.changeUserRole); // Cambiar rol
router.delete('/:id', userController.deleteUser); // Borrar


module.exports = router;