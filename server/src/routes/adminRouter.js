const adminRouter = require('express').Router();
const AdminController = require('../controllers/adminController');
const { verifyAccessToken } = require('../middlewares/veryfyToken');
const { checkAdmin } = require('../middlewares/checkAdmin');

// Apply admin check to all routes
adminRouter.use(verifyAccessToken, checkAdmin);

// Dashboard
adminRouter.get('/dashboard', AdminController.getDashboard);

// Users management
adminRouter.get('/users', AdminController.getAllUsers);
adminRouter.get('/users/:id', AdminController.getUserById);
adminRouter.put('/users/:id', AdminController.updateUser);
adminRouter.delete('/users/:id', AdminController.deleteUser);

// Orders management
adminRouter.get('/orders', AdminController.getAllOrders);
adminRouter.get('/orders/:id', AdminController.getOrderById);
adminRouter.put('/orders/:id', AdminController.updateOrder);
adminRouter.patch('/orders/:id/status', AdminController.updateOrderStatus);
adminRouter.delete('/orders/:id', AdminController.deleteOrder);

// Order items management
adminRouter.post('/orders/:orderId/items', AdminController.addOrderItem);
adminRouter.delete('/order-items/:itemId', AdminController.removeOrderItem);

module.exports = adminRouter;