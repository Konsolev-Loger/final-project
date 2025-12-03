/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
    await queryInterface.sequelize.query(`
      SELECT setval(pg_get_serial_sequence('"Categories"', 'id'), 
             COALESCE((SELECT MAX(id) FROM "Categories"), 1), 
             false);
    `);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Categories');
  },
};
