// controllers/orderController.js
const OrderService = require('../services/orderService');
const formatResponse = require('../utils/formatResponse');

class OrderController {
  // 1. Создать полный заказ (с комнатами и позициями)
  //   static async create(req, res) {
  //     const {user} = res.locals
  //       const { user_id, comment, total_price, customRooms, items } = req.body;
  //     try {
  //       // eslint-disable-next-line camelcase
  //       if (!user_id || !total_price) {
  //         return res
  //           .status(400)
  //           .json(formatResponse(400, 'Неверные данные', null, 'user_id и total_price обязательны'));
  //       }
  //       const order = await OrderService.createFullOrder({
  //         user_id,
  //         comment: comment || '',
  //         total_price,
  //         customRooms: customRooms || [],
  //         items: items || [],
  //       });

  //       return res.status(201).json(formatResponse(201, 'Заказ успешно создан', order, null));
  //     } catch (error) {
  //       return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
  //     }
  //   }
  static async create(req, res) {
    const { user } = res.locals;
    const { items, customRooms, comment } = req.body;

    if (!items?.length) {
      return res.status(400).json(formatResponse(400, 'Корзина пуста'));
    }

    const order = await OrderService.createOrder(
      user.id,
      items,
      customRooms || [],
      comment || '',
    );

    return res
      .status(201)
      .json(formatResponse(201, 'Заказ создан', { orderId: order.id }));
  }

  // 2. Получить один заказ по ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.getById(id);

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

  // 3. Получить все заказы пользователя
  static async getUserOrders(req, res) {
    try {
      const { userId } = req.params; // или req.user.id, если есть авторизация
      const orders = await OrderService.getUserOrders(userId);

      return res
        .status(200)
        .json(formatResponse(200, 'Заказы пользователя получены', orders, null));
    } catch (error) {
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 4. Обновить статус заказа (например, подтвердить/отклонить)
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // true / false

      if (typeof status !== 'boolean') {
        return res
          .status(400)
          .json(formatResponse(400, 'Статус должен быть true или false', null));
      }

      const order = await OrderService.updateStatus(id, status);
      return res
        .status(200)
        .json(formatResponse(200, 'Статус заказа обновлён', order, null));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, 'Заказ не найден', null));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 5. Обновить комментарий
  static async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      const order = await OrderService.updateComment(id, comment || '');
      return res
        .status(200)
        .json(formatResponse(200, 'Комментарий обновлён', order, null));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, 'Заказ не найден', null));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // 6. Удалить заказ полностью
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await OrderService.delete(id);

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
}

module.exports = OrderController;
