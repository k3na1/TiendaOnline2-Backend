'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // CAMBIO: Definir las relaciones
      
      // 1. Pertenece a un Usuario
      Receipt.belongsTo(models.Users, { 
        foreignKey: 'usuarioId', 
        as: 'usuario' 
      });
      
      // 2. Tiene muchos Detalles (Productos comprados)
      Receipt.hasMany(models.ReceiptDetail, {
        foreignKey: 'receiptId',
        as: 'detalles'
      });
    }
  }
  Receipt.init({
    usuarioId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    calle: DataTypes.STRING,
    numero: DataTypes.STRING,
    depto: DataTypes.STRING,
    region: DataTypes.STRING,
    comuna: DataTypes.STRING,
    codigoPostal: DataTypes.STRING,
    detalles: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Receipt',
  });
  return Receipt;
};