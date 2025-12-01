    const users = [
      {
        name: 'Jojo',
        email: 'jojo@test.com',
    password: 'SermerLORD@@10',
        phone: '1234567890',
        is_admin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Putin',
    email: 'Putin@test.com',
    password: 'SermerLORD@@10',
        phone: '1234567890',
        is_admin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    // ✅ Удаляем конкретных пользователей для безопасности
    await queryInterface.bulkDelete('Users', {
      email: ['jojo@test.com', 'Putin@test.com']
    }, {});
  },
};