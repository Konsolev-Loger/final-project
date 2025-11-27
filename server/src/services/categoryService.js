const { Category, Material } = require('../../db/models');

class CategoryService {
  static async getAll() {
    return Category.findAll({
      include: [{ model: Material, as: 'materials' }],
    });
  }

  // static async getById(id) {
  //   const category = await Category.findByPk(id, {
  //     // include: [{ model: Material, as: 'materials' }],
  //   });
  //   if (!category) throw new Error('Категория не найдена');
  //   return category;
  // }

  static async create(data) {
    return Category.create(data);
  }

  static async update(id, data) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Категория не найдена');
    return category.update(data);
  }

  static async delete(id) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Категория не найдена');
    // Нельзя удалить, если есть материалы
    const hasMaterials = await Material.count({ where: { category_id: id } });
    if (hasMaterials > 0) {
      throw new Error('Нельзя удалить категорию: есть связанные материалы');
    }
    await category.destroy();
    return { message: 'Категория удалена' };
  }
}
module.exports = CategoryService;
