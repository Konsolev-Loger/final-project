/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CastomRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      total_price: {
        type: Sequelize.DECIMAL
      },
      length: {
        type: Sequelize.DECIMAL
      },
      width: {
        type: Sequelize.DECIMAL
      },
      height: {
        type: Sequelize.DECIMAL
      },
      area: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, ) {
    await queryInterface.dropTable('CastomRooms');
  }
};