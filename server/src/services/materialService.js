const { Material, Category, OrderItem } = require('../../db/models');

class MaterialService {
  static async getAll() {
    return Material.findAll({
      include: [{ model: Category, as: 'category' }],
    });
  }

  static async getById(id) {
    const material = await Material.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });
    if (!material) throw new Error('Материал не найден');
    return material;
  }

  static async create(data) {
    return Material.create(data);
  }

  static async update(id, data) {
    const material = await Material.findByPk(id);
    if (!material) throw new Error('Материал не найден');
    return material.update(data);
  }

  static async delete(id) {
    const material = await Material.findByPk(id);
    if (!material) throw new Error('Материал не найден');

    // Нельзя удалить, если материал используется в заказах
    const usedInOrders = await OrderItem.count({ where: { material_id: id } });
    if (usedInOrders > 0) {
      throw new Error('Нельзя удалить материал: он используется в заказах');
    }

    await material.destroy();
    return { message: 'Материал удалён' };
  }
}

module.exports = MaterialService;
