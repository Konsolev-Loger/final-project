const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CastomRoom extends Model {
    static associate(models) {
      CastomRoom.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
      CastomRoom.hasMany(models.OrderItem, {
        foreignKey: 'castom_room_id',
        as: 'orderItems',
      });
    }
  }
  CastomRoom.init(
    {
      order_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      // total_price: DataTypes.DECIMAL,
      length: DataTypes.DECIMAL,
      width: DataTypes.DECIMAL,
      height: DataTypes.DECIMAL,
      area: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'CastomRoom',
    },
  );
  return CastomRoom;
};
