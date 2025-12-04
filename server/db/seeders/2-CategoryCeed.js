const categories = [
  {
    name: 'Настенные покрытия',
  },
  {
    name: 'Напольные покрытия',
  },
  {
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
