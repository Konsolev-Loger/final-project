const materials = [
  {
    category_id: 1,
    name: '',
    title: '',
    price: 863,
    unit_m2: false,
    is_popular: true,
    img: '',
  },
  {
    category_id: 1,
    name: '',
    title: '',
    price: 863,
    unit_m2: false,
    is_popular: true,
    img: '',
  },
  {
    category_id: 1,
    name: '',
    title: '',
    price: 863,
    unit_m2: false,
    is_popular: true,
    img: '',
  },
  {
    category_id: 1,
    name: '',
    title: '',
    price: 863,
    unit_m2: false,
    is_popular: true,
    img: '',
  },
  {
    category_id: 1,
    name: '',
    title: '',
    price: 863,
    unit_m2: false,
    is_popular: true,
    img: '',
  },
    {
    category_id: 1,
    name: '',
    title: '',
    price: 863,
    unit_m2: false,
    is_popular: true,
    img: '',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Materials', materials);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Materials', null, {})
  },
};
