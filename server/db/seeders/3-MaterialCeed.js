const Category = [
  {
    category_id: 1,
    name: 'Декоративный кирпич Орли 465',
    title: '«Орли 465» передаёт дух старины благодаря состаренной фактуре и хаотичным трещинам.',
    price: 500,
    unit_m2: 0,
    is_popular: false,
    img: 11,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Materials', Category, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Materials', null, {});
  },
};
