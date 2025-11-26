const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.hasMany(models.OrderItem, { foreignKey: 'material_id', as: 'orderItems' });
    }
  }
  Material.init(
    {
      name: DataTypes.STRING,
      title: DataTypes.STRING,
      price: DataTypes.INTEGER,
      unit_m2: DataTypes.DECIMAL,
      is_popular: DataTypes.BOOLEAN,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Material',
    },
  );
  return Material;
};
