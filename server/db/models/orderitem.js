const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
      OrderItem.belongsTo(models.Material, { foreignKey: 'material_id', as: 'material' });
      OrderItem.belongsTo(models.Room, { foreignKey: 'room_id', as: 'room' });
      OrderItem.belongsTo(models.CastomRoom, {
        foreignKey: 'castom_room_id',
        as: 'castomRoom',
      });
    }
  }
  OrderItem.init(
    {
      order_id: DataTypes.INTEGER,
      material_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
      castom_room_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price_at: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItem',
    },
  );
  return OrderItem;
};
