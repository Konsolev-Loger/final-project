'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CastomRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CastomRoom.init({
    name: DataTypes.STRING,
    total_price: DataTypes.DECIMAL,
    length: DataTypes.DECIMAL,
    width: DataTypes.DECIMAL,
    height: DataTypes.DECIMAL,
    area: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'CastomRoom',
  });
  return CastomRoom;
};