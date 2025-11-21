'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Products, { // Ojo: Tu modelo se llama 'Products' (Plural)
        foreignKey: 'categoriaId',
        as: 'productos'
      });
    }
  }
  Category.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};