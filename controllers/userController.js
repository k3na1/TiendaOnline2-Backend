const { Users } = require('../models'); // Importamos el modelo 'Users' (Plural)

const userController = {
    
    // 1. CREAR USUARIO (Registro)
    // POST /api/users
    createUser: async (req, res) => {
        try {
            // Solo extraemos los datos permitidos. NO extraemos 'tipo'.
            const { run, nombre, apellidos, correo, password } = req.body;

            // Validamos que no falten datos
            if (!run || !nombre || !correo || !password) {
                return res.status(400).json({ message: 'Faltan datos obligatorios' });
            }

            // Creamos el usuario forzando el tipo
            const nuevoUsuario = await Users.create({
                run,
                nombre,
                apellidos,
                correo,
                password, // OJO: Idealmente aquí usaríamos bcrypt.hash(password, 10)
                tipo: 'cliente' // <--- AQUI ESTÁ TU REGLA: Siempre se crea como cliente
            });

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                usuario: nuevoUsuario
            });
        } catch (error) {
            console.error(error);
            // Si el error es por RUN o Correo duplicado (unique constraint)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'El RUN o Correo ya están registrados' });
            }
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    },

    // 2. OBTENER TODOS (Para el admin)
    // GET /api/users
    getAllUsers: async (req, res) => {
        try {
            const usuarios = await Users.findAll();
            res.json(usuarios);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    },

    // 3. OBTENER UNO (Por ID)
    // GET /api/users/:id
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Users.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar usuario' });
        }
    },

    // 4. ACTUALIZAR (Editar perfil)
    // PUT /api/users/:id
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, apellidos, correo } = req.body; // No dejamos editar RUN ni TIPO aquí

            const usuario = await Users.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Actualizamos
            await usuario.update({ nombre, apellidos, correo });

            res.json({ message: 'Usuario actualizado', usuario });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
    },

    // 5. ELIMINAR
    // DELETE /api/users/:id
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const eliminado = await Users.destroy({ where: { id } });

            if (!eliminado) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    },

    // Podrías agregar esto a tu userController.js más adelante

    changeUserRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { tipo } = req.body; // Solo recibimos el nuevo rol

            // Validar que el tipo sea válido
            if (!['cliente', 'admin', 'vendedor'].includes(tipo)) {
                return res.status(400).json({ message: 'Tipo de usuario no válido' });
            }

            const usuario = await Users.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await usuario.update({ tipo });
            res.json({ message: `Rol actualizado a ${tipo}` });
        } catch (error) {
            res.status(500).json({ message: 'Error al cambiar rol' });
        }
    }
};

module.exports = userController;