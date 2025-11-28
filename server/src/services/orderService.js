// services/orderService.js
const { Order, OrderItem, CastomRoom } = require('../../db/models');

class OrderService {
  static async getAll() {
    return Order.findAll({
      include: [
        { model: OrderItem, as: 'items', include: ['material', 'room', 'castomRooms'] },
        { model: CastomRoom, as: 'castomRooms' },
      ],
    });
  }

  // Создание полного заказа (как было раньше)
  static async createFullOrder({
    user_id: userId,
    comment = '',
    total_price, // ← возможно нужно будет передалть что бы считалось на бэке
    castomRooms = [],
    items = [],
  }) {
    // 1. Создаём заказ (total_price берём как есть)
    const order = await Order.create({
      user_id: userId,
      comment,
      status: false,
      total_price,
    });

    // 2. Кастомные комнаты (если есть)
    if (castomRooms.length > 0) {
      const rooms = castomRooms.map((r) => ({
        ...r,
        order_id: order.id,
        // area: r.length && r.width ? Math.round(r.length * r.width * 100) / 100 : null,
      }));
      await CastomRoom.bulkCreate(rooms);
    }

    // 3. Позиции заказа (если есть)
    if (items.length > 0) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        material_id: item.material_id,
        room_id: item.room_id || null,
        castom_room_id: item.castom_room_id || null,
        quantity: item.quantity || 1,
        price_at: item.price_at || item.material_price || 0,
      }));
      await OrderItem.bulkCreate(orderItems);
    }

    // 4. Возвращаем полный заказ
    return Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items', include: ['material', 'room', 'castomRooms'] },
        { model: CastomRoom, as: 'castomRooms' },
      ],
    });
  }

  // Получить заказ со всеми связями
  static async getById(id, userId) {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: ['material', 'room', 'castomRooms'],
        },
        {
          model: CastomRoom,
          as: 'castomRooms',
        },
      ],
    });

    if (!order) {
      throw new Error('Заказ не найден');
    }

    // Ключевая проверка — заказ должен принадлежать пользователю
    if (order.user_id !== userId) {
      throw new Error('Доступ запрещён');
    }

    return order;
  }

  // 2. Все заказы текущего пользователя
  static async getUserOrders(userId) {
    return Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: ['material'],
        },
        {
          model: CastomRoom,
          as: 'castomRooms',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // 3. Обновить статус (только своего заказа)
  static async updateStatus(id, status, userId) {
    // Сначала получаем с проверкой владельца
    const order = await this.getById(id, userId);

    await order.update({ status });

    // Возвращаем свежие данные
    return this.getById(id, userId);
  }

  // 4. Обновить комментарий (только своего заказа)
  static async updateComment(id, comment, userId) {
    const order = await this.getById(id, userId);

    await order.update({ comment: comment || '' });

    return this.getById(id, userId);
  }

  // Полное удаление заказа (со всеми позициями и кастомными комнатами)
  static async delete(id, userId) {
    const order = await this.getById(id, userId); // проверка существования + прав

    // Просто удаляем всё по очереди — быстро и понятно
    await OrderItem.destroy({ where: { order_id: id } });
    await CastomRoom.destroy({ where: { order_id: id } });
    await order.destroy();

    return { message: 'Заказ полностью удалён' };
  }

  // ───────────────── НОВЫЕ МЕТОДЫ ДЛЯ КОРЗИНЫ ─────────────────

  // 1. Получить или создать корзину пользователя
  static async getCart(userId) {
    let cart = await Order.findOne({
      where: { user_id: userId, is_cart: true },
      include: [
        { model: OrderItem, as: 'items', include: ['material', 'room', 'castomRooms'] },
        { model: CastomRoom, as: 'castomRooms' },
      ],
    });

    if (!cart) {
      cart = await Order.create({
        user_id: userId,
        total_price: 0,
        comment: '',
        status: null,
        is_cart: true,
      });
      // После создания — сразу подгружаем связи
      await cart.reload({
        include: [
          { model: OrderItem, as: 'items', include: ['material', 'room', 'castomRooms'] },
          { model: CastomRoom, as: 'castomRooms' },
        ],
      });
    }

    return cart;
  }

  static async addToCart(userId, itemData) {
    const cart = await this.getCart(userId);

    const existing = await OrderItem.findOne({
      where: {
        order_id: cart.id,
        material_id: itemData.material_id,
        room_id: itemData.room_id || null,
        castom_room_id: itemData.castom_room_id || null,
      },
    });

    if (existing) {
      await existing.increment('quantity', { by: itemData.quantity || 1 });
    } else {
      await OrderItem.create({
        order_id: cart.id,
        material_id: itemData.material_id,
        room_id: itemData.room_id || null,
        castom_room_id: itemData.castom_room_id || null,
        quantity: itemData.quantity || 1,
        price_at: itemData.price_at,
      });
    }

    // ← Самый простой и правильный пересчёт
    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price_at,
      0,
    );
    await cart.update({ total_price: total });

    return cart; // уже с актуальными items и total_price
  }

  static async removeFromCart(userId, itemId) {
    const cart = await this.getCart(userId);

    await OrderItem.destroy({ where: { id: itemId, order_id: cart.id } });

    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price_at,
      0,
    );
    await cart.update({ total_price: total });

    return cart;
  }

  static async clearCart(userId) {
    const cart = await this.getCart(userId);

    await OrderItem.destroy({ where: { order_id: cart.id } });
    await CastomRoom.destroy({ where: { order_id: cart.id } });

    await cart.update({ total_price: 0 });

    return cart;
  }

  static async checkout(userId, comment = '') {
    const cart = await this.getCart(userId);

    if (!cart.items?.length && !cart.castomRooms?.length) {
      throw new Error('Корзина пуста');
    }

    await cart.update({
      is_cart: false,
      status: false,
      comment: comment.trim(),
    });

    return cart;
  }
}

module.exports = OrderService;
