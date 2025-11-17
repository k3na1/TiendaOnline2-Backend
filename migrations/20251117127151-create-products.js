'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.STRING
      },
      precio: {
        allowNull: false,
        type: Sequelize.STRING
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories', // Nombre de la tabla de categorías
          key: 'id'          // Columna a la que hace referencia
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // O 'CASCADE' / 'RESTRICT' según tu lógica de negocio
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
