const categories = [
  {
    id: 1,
    name: 'wall',
  },
  {
    id: 2,
    name: 'floor',
  },
  {
    id: 3,
    name: 'roof',
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
