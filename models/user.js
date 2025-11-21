'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Receipt, { // Ojo: El modelo se llama 'Receipt' (Singular)
        foreignKey: 'usuarioId',
        as: 'compras' // Así podrás hacer: user.getCompras()
    });
    }
  }
  Users.init({
    run: DataTypes.INTEGER,
    tipo: DataTypes.STRING,
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};