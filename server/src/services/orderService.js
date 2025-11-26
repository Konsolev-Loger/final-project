// services/orderService.js
const { Order, OrderItem, CastomRoom, sequelize } = require('../../db/models');

class OrderService {
  // Создание полного заказа (как было раньше)

  static async createFullOrder({
    user_id,
    comment = '',
    total_price, // ← уже готовое число с фронта
    customRooms = [],
    items = [],
  }) {
    // 1. Создаём заказ (total_price берём как есть)
    const order = await Order.create({
      user_id,
      comment,
      status: false,
      total_price, // просто сохраняем то, что прислал клиент
    });

    // 2. Кастомные комнаты (если есть)
    if (customRooms.length > 0) {
      const rooms = customRooms.map((r) => ({
        ...r,
        order_id: order.id,
        area: r.length && r.width ? Math.round(r.length * r.width * 100) / 100 : null,
      }));
      await CastomRoom.bulkCreate(rooms);
    }

    // 3. Позиции заказа (если есть)
    if (items.length > 0) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        material_id: item.material_id,
        room_id: item.room_id || null,
        custom_room_id: item.custom_room_id || null,
        quantity: item.quantity || 1,
        price_at: item.price_at || item.material_price || 0,
      }));
      await OrderItem.bulkCreate(orderItems);
    }

    // 4. Возвращаем полный заказ
    return  Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items', include: ['material', 'room', 'customRoom'] },
        { model: CastomRoom, as: 'customRooms' },
      ],
    });
  }

  // Получить заказ со всеми связями
  static async getById(id) {
    const order = await Order.findByPk(id, {
      include: [
        { model: OrderItem, as: 'items', include: ['material', 'room', 'customRoom'] },
        { model: CastomRoom, as: 'customRooms' },
      ],
    });
    if (!order) throw new Error('Заказ не найден');
    return order;
  }

  // Все заказы пользователя
  static async getUserOrders(userId) {
    return Order.findAll({
      where: { user_id: userId },
      include: [
        { model: OrderItem, as: 'items', include: ['material'] },
        { model: CastomRoom, as: 'customRooms' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Изменить статус заказа
  static async updateStatus(id, status) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error('Заказ не найден');
    await order.update({ status });
    return this.getById(id);
  }

  // Изменить комментарий
  static async updateComment(id, comment) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error('Заказ не найден');
    await order.update({ comment });
    return this.getById(id);
  }

  // Полное удаление заказа (со всеми позициями и кастомными комнатами)
  static async delete(id) {
    return sequelize.transaction(async (t) => {
      const order = await Order.findByPk(id);
      if (!order) throw new Error('Заказ не найден');

      await OrderItem.destroy({ where: { order_id: id }, transaction: t });
      await CastomRoom.destroy({ where: { order_id: id }, transaction: t });
      await order.destroy({ transaction: t });

      return { message: 'Заказ полностью удалён' };
    });
  }
}

module.exports = OrderService;
