const rooms = [
  {
    name: 'Гостиная 1',
    area: 15,
    img: 'Гостиная 1.jpg',
  },
  {
    name: 'Гостиная 2',
    area: 20,
    img: 'Гостиная 2.jpg',
  },
  {
    name: 'Гостиная 3',
    area: 25,
    img: 'Гостиная 3.jpg',
  },
  {
    name: 'Кухня 1',
    area: 9,
    img: 'Кухня 1.jpg',
  },
  {
    name: 'Кухня 2',
    area: 12,
    img: 'Кухня 2.jpg',
  },
  {
    name: 'Кухня 3',
    area: 15,
    img: 'Кухня 3.jpg',
  },
  {
    name: 'Спальня 1',
    area: 10,
    img: 'Спальня 1.jpg',
  },
  {
    name: 'Спальня 2',
    area: 14,
    img: 'Спальня 2.jpg',
  },
  {
    name: 'Спальня 3',
    area: 18,
    img: 'Спальня 3.jpg',
  },
  {
    name: 'Студия 1',
    area: 25,
    img: 'Студия 2.jpg',
  },
  {
    name: 'Студия 2',
    area: 40,
    img: 'Студия.jpg',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Rooms', rooms);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Rooms', null, {});
  },
};