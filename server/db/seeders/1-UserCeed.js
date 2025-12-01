"use strict";

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Хешируем пароли для ВСЕХ пользователей
    const hashedPasswordJojo = await bcrypt.hash("SermerLORD@@10", 10);
    const hashedPasswordPutin = await bcrypt.hash("SermerLORD@@10", 10);

    const users = [
      {
        name: 'Jojo',
        email: 'jojo@test.com',
        password: hashedPasswordJojo,  
        phone: '1234567890',
        is_admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Putin',
        email: 'putin@krab.com',                  // Путин Краб
        password: hashedPasswordPutin,  
        phone: '1234567890',
        is_admin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Users', {
      email: ['jojo@test.com', 'Putin@test.com']
    }, {});
  },
};