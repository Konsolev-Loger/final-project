const Category = [
  {
    category_id: 1,
    name: 'Декоративный кирпич Орли 465',
    title:
      '«Орли 465» передаёт дух старины благодаря состаренной фактуре и хаотичным трещинам.',
    price: 500,
    unit_m2: 0,
    is_popular: false,
    img: 11,
  },
  {
    category_id: 1,
    name: 'Декоративный кирпич Орли 403',
    title:
      '«Орли 403» является элементом коллекции искусственный камень Leonardo Stone Орли.',
    price: 550,
    unit_m2: 0,
    is_popular: false,
    img: 12,
  },
  {
    category_id: 1,
    name: 'Декоративный кирпич Орли 707',
    title:
      '«Орли 707» является элементом коллекции искусственный камень. Панели из состаренного кирпича создают ощущение тепла и уюта.',
    price: 450,
    unit_m2: 0,
    is_popular: false,
    img: 13,
  },
  {
    category_id: 1,
    name: 'Декоративный кирпич Орли 787',
    title:
      '«Орли 707» является элементом коллекции искусственный камень. Для ценителей классики.',
    price: 450,
    unit_m2: 0,
    is_popular: true,
    img: 14,
  },
  {
    category_id: 1,
    name: 'Декоративный кирпич Париж-2 052',
    title:
      'Коллекция "Париж-2" - идеальное сочетание стиля и качества. Яркое и модное решение для вашего дома.',
    price: 450,
    unit_m2: 0,
    is_popular: true,
    img: 15,
  },
  {
    category_id: 1,
    name: 'Искусственный камень Монако 464',
    title:
      'Коллекция "Монако" для любителей модерна. Ваш дом будет выглядеть эффектно и респектабельно.',
    price: 450,
    unit_m2: 0,
    is_popular: true,
    img: 16,
  },
    {
    category_id: 1,
    name: 'Ригельный кирпич Роттердам 707',
    title:
      'Ригельный кирпич «Роттердам 707» добавит характер и стиль вашему интерьеру',
    price: 450,
    unit_m2: 0,
    is_popular: true,
    img: 17,
  },
     {
    category_id: 1,
    name: 'Ригельный кирпич Сиэтл 403 mix',
    title:
'Ригельный кирпич «Сиэтл 403 mix» подойдет любителям брутальных оттенков.',
    price: 450,
    unit_m2: 0,
    is_popular: true,
    img: 17,
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
