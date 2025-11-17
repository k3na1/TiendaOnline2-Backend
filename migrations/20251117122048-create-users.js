'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        run: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
        },
        tipo: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        nombre: {
          type: Sequelize.STRING,
          allowNull: false
        },
        apellidos: {
          allowNull: false,
          type: Sequelize.STRING
        },
        correo : {
          allowNull: false,
          type: Sequelize.STRING
        },
        password : {
          allowNull: false,
          type: Sequelize.STRING
        }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
