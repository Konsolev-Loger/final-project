const orderRouter = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyAccessToken } = require('../middlewares/veryfyToken');

orderRouter.post('/', verifyAccessToken, orderController.createOrder);
orderRouter.get('/:id', orderController.getById);
orderRouter.get('/user', verifyAccessToken, orderController.getUserOrders);
orderRouter.put('/:id', verifyAccessToken, orderController.updateStatus);
orderRouter.put('/comment/:id',verifyAccessToken, orderController.updateComment);
orderRouter.delete('/:id',verifyAccessToken, orderController.delete);

module.exports = orderRouter;

// {
//   "user_id": 1,
//   "total_price": 2999.99,
//   "comment": "Доставить до 18:00",
//   "status": true
// }
