'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Orders',
      [
        {
          user_id: 1,
          total_price: 2999.99,
          comment: 'Доставка до подъезда',
          status: true,
          is_cart: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          total_price: 5499.5,
          comment: 'Позвонить за час до доставки',
          status: false,
          is_cart: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
