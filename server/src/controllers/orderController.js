// controllers/orderController.js
const OrderService = require('../services/orderService');
const formatResponse = require('../utils/formatResponse');

class OrderController {
  // 1. Создать полный заказ (с комнатами и позициями)
  //   static async create(req, res) {
  //     const {user} = res.locals
  //       const { user_id, comment, total_price, castomRooms, items } = req.body;
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
  //         castomRooms: castomRooms || [],
  //         items: items || [],
  //       });

  //       return res.status(201).json(formatResponse(201, 'Заказ успешно создан', order, null));
  //     } catch (error) {
  //       return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
  //     }
  //   }
  static async createOrder(req, res) {
    const { user } = res.locals;
    const { comment, total_price, castomRooms, items } = req.body;
    // Если есть авторизация — берём из токена, иначе (админ) — из тела

    const finalUserId = user?.id;
    if (!finalUserId)
      return res
        .status(400)
        .json(formatResponse(400, 'Неверные данные', null, 'user_id обязательны'));
    const order = await OrderService.createFullOrder({
      user_id: finalUserId, // ← сюда можно пихать что угодно
      comment: comment || '',
      total_price,
      castomRooms: castomRooms || [],
      items: items || [],
    });

    return res.status(201).json(formatResponse(201, 'Заказ создан', order));
  }

  // 2. Получить один заказ по ID
  static async getById(req, res) {
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
  static async getUserOrders(req, res) {
    const { user } = res.locals;
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

      const updatedOrder = await OrderService.updateStatus(id, status);

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

      const updatedOrder = await OrderService.updateComment(id, comment || '');

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
