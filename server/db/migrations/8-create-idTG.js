module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'telegram_chat_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  },

  down: async (queryInterface, ) => {
    await queryInterface.removeColumn('Users', 'telegram_chat_id');
  },
};
