const categories = [
  {
    id: 1,
    name: 'Настенные покрытия',
  },
  {
    id: 2,
    name: 'Напольные покрытия',
  },
  {
    id: 3,
    name: 'Потолочная отделка',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Categories', categories);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
