// controllers/orderController.js
const OrderService = require('../services/orderService');
const formatResponse = require('../utils/formatResponse');

class OrderController {
  static async getAll(req, res) {
    try {
      const orders = await OrderService.getAll();
      console.log(orders, 'fffffffffffffffffff');

      return res.status(200).json(formatResponse(200, 'Заказы получены', orders, null));
    } catch (error) {
      console.log(error);
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async createOrder(req, res) {
    const { user } = res.locals;
    const { comment, total_price, castomRooms, items } = req.body;
    // Если есть авторизация — берём из токена, иначе (админ) — из тела
    try {
      const finalUserId = user?.id;
      if (!finalUserId)
        return res
          .status(400)
          .json(formatResponse(400, 'Неверные данные', null, 'user_id обязательны'));
      const order = await OrderService.createFullOrder({
        user_id: finalUserId,
        comment: comment || '',
        total_price,
        castomRooms: castomRooms || [],
        items: items || [],
      });

      return res.status(201).json(formatResponse(201, 'Заказ создан', order));
    } catch (error) {
      console.log('Ошибка CreateOrder', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 2. Получить один заказ по ID
  static async getByIdorder(req, res) {
    const { user } = res.locals;
    const { id } = req.params;
    try {
      const order = await OrderService.getById(id, user.id);
      return res.status(200).json(formatResponse(200, 'Заказ найден', order, null));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res
          .status(404)
          .json(formatResponse(404, 'Заказ не найден', null, error.message));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 2. Получить все заказы текущего пользователя
  static async getUserOrdersController(req, res) {
    const { user } = res.locals;
    console.log(user, 'USERUSERUSER+++++++++++++++++++');

    try {
      const orders = await OrderService.getUserOrders(user.id);

      return res.status(200).json(formatResponse(200, 'Заказы получены', orders, null));
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 3. Обновить статус заказа (пользователь может только подтвердить/отменить свой заказ)
  static async updateStatus(req, res) {
    const { user } = res.locals;
    const { id } = req.params;
    const { status } = req.body;

    try {
      console.log(id, status, user.id);
      if (typeof status !== 'boolean') {
        return res
          .status(400)
          .json(formatResponse(400, 'Поле status должно быть true или false', null));
      }

      const order = await OrderService.getById(id, user.id); // проверка принадлежности внутри

      if (order.user_id !== user.id) {
        return res
          .status(403)
          .json(formatResponse(403, 'Вы не можете изменить статус чужого заказа', null));
      }

      const updatedOrder = await OrderService.updateStatus(id, status, user.id);

      return res
        .status(200)
        .json(formatResponse(200, 'Статус заказа обновлён', updatedOrder, null));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, 'Заказ не найден', null));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 4. Обновить комментарий к заказу
  static async updateComment(req, res) {
    const { user } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;

    try {
      const order = await OrderService.getById(id, user.id);

      if (order.user_id !== user.id) {
        return res
          .status(403)
          .json(formatResponse(403, 'Вы не можете редактировать чужой заказ', null));
      }

      const updatedOrder = await OrderService.updateComment(id, comment || '', user.id);

      return res
        .status(200)
        .json(formatResponse(200, 'Комментарий обновлён', updatedOrder, null));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, 'Заказ не найден', null));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 5. Удалить свой заказ полностью
  static async delete(req, res) {
    const { user } = res.locals;
    const { id } = req.params;

    try {
      const order = await OrderService.getById(id, user.id);

      if (order.user_id !== user.id) {
        return res
          .status(403)
          .json(formatResponse(403, 'Вы не можете удалить чужой заказ', null));
      }

      const result = await OrderService.delete(id, user.id);

      return res.status(200).json(formatResponse(200, result.message, null, null));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, 'Заказ не найден', null));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }
  // НОВЫЕ МЕТОДЫ ДЛЯ КОРЗИНЫ

  // 1. Получить корзину текущего пользователя
  static async getCart(req, res) {
    try {
      const { user } = res.locals;
      const cart = await OrderService.getCart(user.id);

      return res.status(200).json(formatResponse(200, 'Корзина получена', cart));
    } catch (error) {
      console.error('getCart error:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 2. Добавить товар в корзину
  static async addToCart(req, res) {
    try {
      const { user } = res.locals;
      const { material_id, room_id, castom_room_id, quantity = 1, price_at } = req.body;

      const updatedCart = await OrderService.addToCart(user.id, {
        material_id,
        // eslint-disable-next-line camelcase
        room_id: room_id || null,
        // eslint-disable-next-line camelcase
        castom_room_id: castom_room_id || null,
        quantity,
        price_at,
      });

      return res
        .status(200)
        .json(formatResponse(200, 'Товар добавлен в корзину', updatedCart));
    } catch (error) {
      console.error('addToCart error:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 3. Удалить позицию из корзины
  static async removeFromCart(req, res) {
    try {
      const { user } = res.locals;
      const { id } = req.params;

      const updatedCart = await OrderService.removeFromCart(user.id, id);

      return res
        .status(200)
        .json(formatResponse(200, 'Товар удалён из корзины', updatedCart));
    } catch (error) {
      console.error( error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 4. Очистить корзину
  static async clearCart(req, res) {
    try {
      const { user } = res.locals;
      const clearedCart = await OrderService.clearCart(user.id);

      return res.status(200).json(formatResponse(200, 'Корзина очищена', clearedCart));
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 5. ОФОРМИТЬ ЗАКАЗ (главная кнопка!)
  static async checkout(req, res) {
    try {
      const { user } = res.locals;
      const { comment = '' } = req.body;

      const order = await OrderService.checkout(user.id, comment);

      return res.status(201).json(formatResponse(201, 'Заказ успешно оформлен!', order));
    } catch (error) {
      if (error.message === 'Корзина пуста') {
        return res.status(400).json(formatResponse(400, error.message));
      }
      console.error('checkout error:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка при оформлении заказа', null, error.message));
    }
  }
}

module.exports = OrderController;
