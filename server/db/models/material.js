const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Material.init({
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    unit_m2: DataTypes.DECIMAL,
    is_popular: DataTypes.BOOLEAN,
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Material',
  });
  return Material;
};