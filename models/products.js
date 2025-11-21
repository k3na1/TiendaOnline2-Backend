'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Un Producto pertenece a una Categoría
    Products.belongsTo(models.Category, {
      foreignKey: 'categoriaId',
      as: 'categoria'
    });
  // Un Producto aparece en muchas ventas (ReceiptDetail)
  // Esto es útil para saber "¿Cuántas veces se vendió este monitor?"
    Products.hasMany(models.ReceiptDetail, {
      foreignKey: 'productId',
      as: 'ventas'
    });
    }
  }
  Products.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    precio: DataTypes.INTEGER,
    categoriaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};