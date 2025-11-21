const { Category } = require('../models');

const categoryController = {
    
    // 1. CREAR CATEGORÍA
    createCategory: async (req, res) => {
        try {
            const { nombre } = req.body;

            if (!nombre) {
                return res.status(400).json({ message: 'El nombre es obligatorio' });
            }

            const nuevaCategoria = await Category.create({ nombre });
            res.status(201).json(nuevaCategoria);

        } catch (error) {
            // Si intentan crear una repetida (gracias al unique: true de la BD)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Esa categoría ya existe' });
            }
            res.status(500).json({ message: 'Error al crear categoría' });
        }
    },

    // 2. OBTENER TODAS
    getAllCategories: async (req, res) => {
        try {
            const categorias = await Category.findAll();
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener categorías' });
        }
    },

    // 3. OBTENER UNA (Con sus productos)
    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            // Aquí incluimos los productos asociados, para ver "Todo lo de Tecnología"
            const categoria = await Category.findByPk(id, {
                include: [{ association: 'productos' }] // Usamos el alias que definimos en category.js
            });

            if (!categoria) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
            res.json(categoria);
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar categoría' });
        }
    },

    // 4. ACTUALIZAR
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre } = req.body;

            const categoria = await Category.findByPk(id);
            if (!categoria) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }

            await categoria.update({ nombre });
            res.json({ message: 'Categoría actualizada', categoria });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar' });
        }
    },

    // 5. ELIMINAR
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            // OJO: Si borras una categoría, los productos pasan a tener categoriaId: NULL
            // (Esto es gracias al onDelete: 'SET NULL' que pusimos en la migración)
            const eliminado = await Category.destroy({ where: { id } });

            if (!eliminado) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
            res.json({ message: 'Categoría eliminada' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar categoría' });
        }
    }
};

module.exports = categoryController;