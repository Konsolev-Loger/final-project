// const { Model } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Category extends Model {
//     static associate(models) {
//       Category.hasMany(models.Material, {
//         foreignKey: 'category_id',
//         as: 'materials',
//       });
//     }
//   }
//   Category.init(
//     {
//       name: DataTypes.STRING,
//     },
//     {
//       sequelize,
//       modelName: 'Category',
//     },
//   );
//   return Category;
// };

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Material, {
        foreignKey: 'category_id',
        as: 'materials',
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
    }
  );

  return Category;
};
