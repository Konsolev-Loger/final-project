const Category = [
  // {
  //   category_id: 1,
  //   name: 'Декоративный кирпич Орли 465',
  //   title:
  //     '«Орли 465» передаёт дух старины благодаря состаренной фактуре и хаотичным трещинам.',
  //   price: '1700 руб./м2',
  //   // unit_m2: 0,
  //   is_popular: false,
  //   img: 'Декоративный кирпич Орли 465.jpg',
  // },
  {
    category_id: 1,
    name: 'Декоративный кирпич Дижон 787',
    title:
      'Декоративный кирпич «Дижон 787» передаст особое очарование старых кирпичных домов, покрытых «благородной городской патиной».',
    price: '1600 руб./м2',
    // unit_m2: 0,
    is_popular: false,
    img: 'Декоративный кирпич Дижон 787.jpg',
  },
  {
    category_id: 1,
    name: 'Декоративный кирпич Орли 403',
    title: 'Ригельный кирпич «Сиэтл 403 mix» подойдет любителям брутальных оттенков.',
    price: '2200 руб./м2',
    // unit_m2: 0,
    is_popular: true,
    img: 'Декоративный кирпич Орли 403.jpg',
  },
  {
    category_id: 1,
    name: 'Декоративный кирпич Орли 465',
    title: '«Орли 465» передаёт дух старины благодаря состаренной фактуре и хаотичным трещинам.',
    price: 500,
    unit_m2: 0,
    is_popular: false,
    img: 'обои 6.jpg',
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
