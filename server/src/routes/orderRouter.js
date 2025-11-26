const orderRouter = require('express').Router();
const orderController = require('../controllers/orderController');

orderRouter.post('/', orderController.createOrder);
orderRouter.get('/:id', orderController.getById);
orderRouter.get('/user', orderController.getUserOrders);
orderRouter.put('/:id', orderController.updateStatus);
orderRouter.put('/comment/:id', orderController.updateComment);
orderRouter.delete('/:id', orderController.delete);

module.exports = orderRouter;