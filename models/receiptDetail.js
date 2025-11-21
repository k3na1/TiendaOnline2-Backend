'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReceiptDetail extends Model {
    static associate(models) {
      // Un detalle pertenece a un recibo
      ReceiptDetail.belongsTo(models.Receipt, { // Cuidado con tu typo 'Recepit'
        foreignKey: 'receiptId',
        as: 'recibo'
      });
      // Un detalle pertenece a un producto
      ReceiptDetail.belongsTo(models.Products, {
        foreignKey: 'productId',
        as: 'producto'
      });
    }
  }
  ReceiptDetail.init({
    receiptId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precioUnitario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReceiptDetail',
    tableName: 'ReceiptDetails' // Forzar nombre de tabla para evitar confusiones
  });
  return ReceiptDetail;
};