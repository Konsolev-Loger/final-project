const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
      Order.hasMany(models.CastomRoom, { foreignKey: 'order_id', as: 'castomRooms' });
    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      total_price: DataTypes.DECIMAL,
      comment: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Order',
    },
  );
  return Order;
};
