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

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
