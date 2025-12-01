// services/adminService.js
const { User, Order, Material, CastomRoom, OrderItem, Category, sequelize } = require('../../db/models'); 
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class AdminService {
  // === USERS ===
  static async getAllUsers(page = 1, limit = 50, search = '') {
    const offset = (page - 1) * limit;
    
    const whereCondition = {};
    if (search) {
      whereCondition.email = {
        [Op.iLike]: `%${search}%`
      };
    }

    const { count, rows: users } = await User.findAndCountAll({
      attributes: [
        'id', 
        'email', 
        'is_admin', 
        'createdAt'
      ],
      include: [{
        model: Order, 
        as: 'orders',
        attributes: [], 
        required: false
      }],
      where: whereCondition,
      group: ['User.id'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      subQuery: false,
      raw: false
    });

    // Получаем количество заказов для каждого пользователя
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const ordersCount = await Order.count({ 
        where: { user_id: user.id } 
      });
      
      return {
        id: user.id,
        email: user.email,
        role: user.is_admin ? 'admin' : 'user',
        createdAt: user.createdAt,
        ordersCount: ordersCount
      };
    }));

    return {
      users: usersWithStats,
      total: count.length || count, // Sequelize возвращает count как массив при GROUP BY
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count.length || count) / limit)
    };
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Order,
          as: 'orders',
          include: [
            { 
              model: OrderItem, 
              as: 'items',
              include: [{ model: Material, as: 'material' }]
            },
            { model: CastomRoom, as: 'castomRooms' },
          ],
        },
      ],
    });
    
    if (!user) throw new Error('Пользователь не найден');
    
    return {
      id: user.id,
      email: user.email,
      role: user.is_admin ? 'admin' : 'user',
      createdAt: user.createdAt,
      orders: user.orders || []
    };
  }

  static async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');

    // Хэшируем пароль
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Преобразуем role → is_admin
    if (userData.role !== undefined) {
      userData.is_admin = userData.role === 'admin';
      delete userData.role;
    }

    // Фильтруем только разрешенные поля
    const allowedFields = ['email', 'password', 'is_admin', 'name', 'phone'];
    const cleanData = {};
    
    Object.keys(userData).forEach(key => {
      if (allowedFields.includes(key) && userData[key] !== undefined) {
        cleanData[key] = userData[key];
      }
    });

    await user.update(cleanData);
    
    return {
      id: user.id,
      email: user.email,
      role: user.is_admin ? 'admin' : 'user',
      createdAt: user.createdAt
    };
  }

  static async updateUserRole(id, role) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Пользователь не найден');
    
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Роль должна быть "user" или "admin"');
    }
    
    await user.update({ is_admin: role === 'admin' });
    
    return {
      id: user.id,
      email: user.email,
      role: role,
      is_admin: role === 'admin'
    };
  }

  static async deleteUser(id) {
    return sequelize.transaction(async (transaction) => {
      const user = await User.findByPk(id, { transaction });
      if (!user) throw new Error('Пользователь не найден');

      const userOrders = await Order.count({ 
        where: { user_id: id }, 
        transaction 
      });
      
      if (userOrders > 0) {
        throw new Error('Нельзя удалить пользователя с существующими заказами');
      }

      await user.destroy({ transaction });
      return { message: 'Пользователь удален' };
    });
  }

  // === ORDERS ===
  static async getAllOrders(page = 1, limit = 50, status = null, search = '') {
    const offset = (page - 1) * limit;
    
    const whereCondition = {};
    
    if (status !== null) {
      whereCondition.status = status === 'true' || status === true;
    }
    
    if (search) {
      whereCondition[Op.or] = [
        { id: { [Op.like]: `%${search}%` } },
        sequelize.where(
          sequelize.cast(sequelize.col('total_price'), 'varchar'),
          { [Op.like]: `%${search}%` }
        )
      ];
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name', 'phone'],
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Material, as: 'material' }],
          required: false
        },
        {
          model: CastomRoom,
          as: 'castomRooms',
          required: false
        }
      ],
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      user_id: order.user_id,
      status: Boolean(order.status),
      total_price: parseFloat(order.total_price),
      comment: order.comment || '',
      createdAt: order.createdAt,
      user: order.user ? {
        id: order.user.id,
        email: order.user.email,
        name: order.user.name,
        phone: order.user.phone
      } : null,
      itemsCount: order.items ? order.items.length : 0,
      castomRoomsCount: order.castomRooms ? order.castomRooms.length : 0
    }));

    return {
      orders: formattedOrders,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  static async getOrderById(id) {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name', 'phone'],
        },
        {
          model: OrderItem,
          as: 'items',
          include: [{ 
            model: Material, 
            as: 'material',
            attributes: ['id', 'name', 'price', 'img']
          }],
        },
        {
          model: CastomRoom,
          as: 'castomRooms',
          attributes: ['id', 'name', 'area', 'length', 'width']
        }
      ],
    });
    
    if (!order) throw new Error('Заказ не найден');
    
    return {
      id: order.id,
      user_id: order.user_id,
      status: Boolean(order.status),
      total_price: parseFloat(order.total_price),
      comment: order.comment || '',
      createdAt: order.createdAt,
      user: order.user,
      items: order.items || [],
      castomRooms: order.castomRooms || []
    };
  }

  static async updateOrder(id, orderData) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error('Заказ не найден');

    // Разрешенные поля
    const allowedFields = ['comment', 'total_price', 'status'];
    const cleanData = {};
    
    Object.keys(orderData).forEach(key => {
      if (allowedFields.includes(key) && orderData[key] !== undefined) {
        cleanData[key] = orderData[key];
      }
    });

    if (cleanData.status !== undefined) {
      cleanData.status = Boolean(cleanData.status);
    }
    
    if (cleanData.total_price !== undefined) {
      cleanData.total_price = parseFloat(cleanData.total_price);
    }

    await order.update(cleanData);
    return this.getOrderById(id);
  }

  static async updateOrderStatus(id, status) {
    if (typeof status !== 'boolean') {
      throw new Error('Статус должен быть boolean');
    }

    const order = await Order.findByPk(id);
    if (!order) throw new Error('Заказ не найден');
    
    await order.update({ status });
    return this.getOrderById(id);
  }

  static async deleteOrder(id) {
    return sequelize.transaction(async (transaction) => {
      const order = await Order.findByPk(id, { transaction });
      if (!order) throw new Error('Заказ не найден');

      await OrderItem.destroy({ where: { order_id: id }, transaction });
      await CastomRoom.destroy({ where: { order_id: id }, transaction });
      await order.destroy({ transaction });

      return { message: 'Заказ полностью удален' };
    });
  }

  // === ORDER ITEMS ===
  static async addOrderItem(orderId, itemData) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Заказ не найден');

    if (!itemData.material_id || itemData.quantity === undefined) {
      throw new Error('material_id и quantity обязательны');
    }

    const material = await Material.findByPk(itemData.material_id);
    if (!material) {
      throw new Error('Материал не найден');
    }

    const orderItem = await OrderItem.create({
      order_id: orderId,
      material_id: parseInt(itemData.material_id),
      quantity: parseInt(itemData.quantity),
      price_at: parseFloat(itemData.price_at) || material.price,
      room_id: itemData.room_id ? parseInt(itemData.room_id) : null,
      castom_room_id: itemData.castom_room_id ? parseInt(itemData.castom_room_id) : null,
    });

    // Обновляем общую стоимость заказа
    const itemsTotal = await OrderItem.sum('price_at', {
      where: { order_id: orderId }
    });
    
    await order.update({ total_price: itemsTotal || 0 });

    return orderItem;
  }

  static async removeOrderItem(itemId) {
    return sequelize.transaction(async (transaction) => {
      const item = await OrderItem.findByPk(itemId, { transaction });
      if (!item) throw new Error('Элемент заказа не найден');
      
      const orderId = item.order_id;
      await item.destroy({ transaction });

      // Обновляем общую стоимость заказа
      const itemsTotal = await OrderItem.sum('price_at', {
        where: { order_id: orderId },
        transaction
      });
      
      const order = await Order.findByPk(orderId, { transaction });
      if (order) {
        await order.update({ 
          total_price: itemsTotal || 0 
        }, { transaction });
      }

      return { message: 'Элемент заказа удален' };
    });
  }

  // === STATISTICS ===
  static async getDashboardStats() {
    const [
      totalUsers, 
      totalOrders, 
      totalRevenue, 
      pendingOrders, 
      totalMaterials, 
      totalCategories
    ] = await Promise.all([
      User.count(),
      Order.count(),
      Order.sum('total_price', { where: { status: true } }) || 0,
      Order.count({ where: { status: false } }),
      Material.count(),
      Category.count()
    ]);

    // Последние 5 заказов
    const recentOrders = await Order.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Самые популярные материалы
    const popularMaterials = await OrderItem.findAll({
      attributes: [
        'material_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity']
      ],
      include: [{
        model: Material,
        as: 'material',
        attributes: ['id', 'name', 'price']
      }],
      group: ['material_id', 'material.id'],
      order: [[sequelize.literal('total_quantity'), 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });

    return {
      totalUsers: Number(totalUsers),
      totalOrders: Number(totalOrders),
      totalRevenue: parseFloat(totalRevenue),
      pendingOrders: Number(pendingOrders),
      totalMaterials: Number(totalMaterials),
      totalCategories: Number(totalCategories),
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        status: order.status,
        total_price: order.total_price,
        createdAt: order.createdAt,
        user_email: order.user?.email
      })),
      popularMaterials: popularMaterials.map(item => ({
        material_id: item.material_id,
        material_name: item.material?.name,
        total_quantity: parseInt(item.total_quantity) || 0
      }))
    };
  }

  // === MATERIALS ===
  static async getAllMaterials(page = 1, limit = 50, search = '') {
    const offset = (page - 1) * limit;
    
    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: materials } = await Material.findAndCountAll({
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      where: whereCondition,
      order: [['id', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedMaterials = materials.map(material => ({
      id: material.id,
      name: material.name,
      title: material.title || '',
      price: parseFloat(material.price),
      description: material.description || '',
      img: material.img || '',
      is_popular: Boolean(material.is_popular),
      category_id: material.category_id,
      category: material.Category ? {
        id: material.Category.id,
        name: material.Category.name
      } : null
    }));

    return {
      materials: formattedMaterials,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  // === CATEGORIES ===
  static async getAllCategories(page = 1, limit = 50, search = '') {
    const offset = (page - 1) * limit;
    
    const whereCondition = {};
    if (search) {
      whereCondition.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows: categories } = await Category.findAndCountAll({
      include: [{
        model: Material,
        attributes: ['id'],
        required: false
      }],
      where: whereCondition,
      order: [['id', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      materialsCount: category.Materials ? category.Materials.length : 0
    }));

    return {
      categories: formattedCategories,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = AdminService;