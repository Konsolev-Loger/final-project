const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.OrderItem, { foreignKey: 'room_id', as: 'orderItems' });
    }
  }
  Room.init(
    {
      name: DataTypes.STRING,
      area: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'Room',
    },
  );
  return Room;
};
