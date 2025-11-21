'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Receipts',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Nombre de la tabla de categorías
          key: 'id'       // Columna a la que hace referencia
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // === AQUI AGREGAS LOS DATOS DE ENVIO ===
        calle: { type: Sequelize.STRING, allowNull: false },
        numero: { type: Sequelize.STRING, allowNull: false },
        depto: { type: Sequelize.STRING, allowNull: true }, // Puede ser nulo (casa)
        region: { type: Sequelize.STRING, allowNull: false },
        comuna: { type: Sequelize.STRING, allowNull: false },
        codigoPostal: { type: Sequelize.STRING, allowNull: true },
        detalles: { type: Sequelize.STRING, allowNull: true }, // Referencias extra
        // ========================================
        createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Receipts');
  }
};
