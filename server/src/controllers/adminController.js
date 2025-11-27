// controllers/adminController.js
const AdminService = require('../services/adminService');
const formatResponse = require('../utils/formatResponse');

class AdminController {
  
  // === DASHBOARD ===
  static async getDashboard(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();
      return res.status(200).json(formatResponse(200, 'Статистика получена', stats));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // === USERS MANAGEMENT ===
  static async getAllUsers(req, res) {
    try {
      const users = await AdminService.getAllUsers();
      return res.status(200).json(formatResponse(200, 'Пользователи получены', users));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await AdminService.getUserById(id);
      return res.status(200).json(formatResponse(200, 'Пользователь найден', user));
    } catch (error) {
      if (error.message === 'Пользователь не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const updatedUser = await AdminService.updateUser(id, userData);
      return res.status(200).json(formatResponse(200, 'Пользователь обновлен', updatedUser));
    } catch (error) {
      if (error.message === 'Пользователь не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await AdminService.deleteUser(id);
      return res.status(200).json(formatResponse(200, result.message));
    } catch (error) {
      if (error.message === 'Пользователь не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      if (error.message.includes('нельзя удалить')) {
        return res.status(400).json(formatResponse(400, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // === ORDERS MANAGEMENT ===
  static async getAllOrders(req, res) {
    try {
      const orders = await AdminService.getAllOrders();
      return res.status(200).json(formatResponse(200, 'Заказы получены', orders));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await AdminService.getOrderById(id);
      return res.status(200).json(formatResponse(200, 'Заказ найден', order));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const orderData = req.body;
      
      const updatedOrder = await AdminService.updateOrder(id, orderData);
      return res.status(200).json(formatResponse(200, 'Заказ обновлен', updatedOrder));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (typeof status !== 'boolean') {
        return res.status(400).json(formatResponse(400, 'Статус должен быть boolean'));
      }
      
      const updatedOrder = await AdminService.updateOrderStatus(id, status);
      return res.status(200).json(formatResponse(200, 'Статус заказа обновлен', updatedOrder));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await AdminService.deleteOrder(id);
      return res.status(200).json(formatResponse(200, result.message));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  // === ORDER ITEMS MANAGEMENT ===
  static async addOrderItem(req, res) {
    try {
      const { orderId } = req.params;
      const itemData = req.body;
      
      const newItem = await AdminService.addOrderItem(orderId, itemData);
      return res.status(201).json(formatResponse(201, 'Элемент добавлен в заказ', newItem));
    } catch (error) {
      if (error.message === 'Заказ не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }

  static async removeOrderItem(req, res) {
    try {
      const { itemId } = req.params;
      const result = await AdminService.removeOrderItem(itemId);
      return res.status(200).json(formatResponse(200, result.message));
    } catch (error) {
      if (error.message === 'Элемент заказа не найден') {
        return res.status(404).json(formatResponse(404, error.message));
      }
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error.message));
    }
  }
}

module.exports = AdminController;