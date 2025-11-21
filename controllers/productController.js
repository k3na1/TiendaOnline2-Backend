const { Products, Category } = require('../models'); // Importamos Modelos

const productController = {

    // 1. CREAR PRODUCTO
    createProduct: async (req, res) => {
        try {
            const { nombre, descripcion, precio, categoriaId } = req.body;

            // CAMBIO: Ya no pedimos categoriaId aquí
            if (!nombre || !precio) {
                return res.status(400).json({ message: 'El nombre y el precio son obligatorios' });
            }

            // Solo si envían una categoría, verificamos que exista
            if (categoriaId) {
                const categoriaExiste = await Category.findByPk(categoriaId);
                if (!categoriaExiste) {
                    return res.status(400).json({ message: 'La categoría especificada no existe' });
                }
            }

            // Si categoriaId es undefined o null, se guarda como NULL en la BD
            const nuevoProducto = await Products.create({
                nombre,
                descripcion,
                precio,
                categoriaId // Puede ir vacío
            });

            res.status(201).json({ message: 'Producto creado', producto: nuevoProducto });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear producto' });
        }
    },

    // 2. OBTENER TODOS (Catálogo)
    getAllProducts: async (req, res) => {
        try {
            const productos = await Products.findAll({
                include: [{ 
                    model: Category, 
                    as: 'categoria',
                    attributes: ['id', 'nombre'] // Solo traemos el nombre de la categoría
                }]
            });
            res.json(productos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener productos' });
        }
    },

    // 3. OBTENER UNO (Detalle)
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await Products.findByPk(id, {
                include: [{ model: Category, as: 'categoria' }]
            });

            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(producto);
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar producto' });
        }
    },

    // 4. ACTUALIZAR PRODUCTO
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion, precio, categoriaId } = req.body;

            const producto = await Products.findByPk(id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Si envían una nueva categoría, verificamos que exista
            if (categoriaId) {
                const cat = await Category.findByPk(categoriaId);
                if (!cat) return res.status(400).json({ message: 'Categoría no válida' });
            }

            await producto.update({ nombre, descripcion, precio, categoriaId });
            res.json({ message: 'Producto actualizado', producto });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar producto' });
        }
    },

    // 5. ELIMINAR PRODUCTO
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const eliminado = await Products.destroy({ where: { id } });

            if (!eliminado) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json({ message: 'Producto eliminado' });
        } catch (error) {
            // Un error común aquí es intentar borrar un producto que ya se vendió
            // (Constraint Error), pero como pusimos 'RESTRICT' en la migración, la BD lo protegerá.
            res.status(500).json({ message: 'Error al eliminar producto' });
        }
    }
};

module.exports = productController;