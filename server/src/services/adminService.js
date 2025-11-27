// services/adminService.js
const { User, Order, Material, Category, Room, CastomRoom, OrderItem } = require('../../db/models');

class AdminService {
  
  // === USERS ===
  static async getAllUsers() {
    return User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Order,
          as: 'orders',
          include: [
            { model: OrderItem, as: 'items' },
            { model: CastomRoom, as: 'customRooms' }
          ]
        }
      ]
    });
    if (!user) throw new Error('Пользователь не найден');
    return user;
  }

  static async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');
    
    // Если обновляется пароль - хэшируем его
    if (userData.password) {
      const bcrypt = require('bcrypt');
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    return user.update(userData);
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');
    
    // Проверяем есть ли заказы у пользователя
    const userOrders = await Order.count({ where: { user_id: id } });
    if (userOrders > 0) {
      throw new Error('Нельзя удалить пользователя с существующими заказами');
    }
    
    await user.destroy();
    return { message: 'Пользователь удален' };
  }

  // === ORDERS (админские методы) ===
  static async getAllOrders() {
    return Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: ['material', 'room', 'customRoom']
        },
        {
          model: CastomRoom,
          as: 'customRooms'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  static async getOrderById(id) {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: ['material', 'room', 'customRoom']
        },
        {
          model: CastomRoom,
          as: 'customRooms'
        }
      ]
    });
    if (!order) throw new Error('Заказ не найден');
    return order;
  }

  static async updateOrder(id, orderData) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error('Заказ не найден');
    return order.update(orderData);
  }

  static async deleteOrder(id) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error('Заказ не найден');
    
    await OrderItem.destroy({ where: { order_id: id } });
    await CastomRoom.destroy({ where: { order_id: id } });
    await order.destroy();
    
    return { message: 'Заказ полностью удален' };
  }

  // === STATISTICS ===
  static async getDashboardStats() {
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const totalMaterials = await Material.count();
    
    const recentOrders = await Order.findAll({
      limit: 5,
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    const popularMaterials = await OrderItem.findAll({
      attributes: [
        'material_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity']
      ],
      include: [{
        model: Material,
        as: 'material',
        attributes: ['name']
      }],
      group: ['material_id', 'material.id'],
      order: [[sequelize.literal('total_quantity'), 'DESC']],
      limit: 5
    });
    
    return {
      totalUsers,
      totalOrders,
      totalMaterials,
      recentOrders,
      popularMaterials
    };
  }

  // === ADVANCED ORDER MANAGEMENT ===
  static async updateOrderStatus(id, status) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error('Заказ не найден');
    return order.update({ status });
  }

  static async addOrderItem(orderId, itemData) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Заказ не найден');
    
    return OrderItem.create({
      ...itemData,
      order_id: orderId
    });
  }

  static async removeOrderItem(itemId) {
    const item = await OrderItem.findByPk(itemId);
    if (!item) throw new Error('Элемент заказа не найден');
    await item.destroy();
    return { message: 'Элемент заказа удален' };
  }
}

module.exports = AdminService;