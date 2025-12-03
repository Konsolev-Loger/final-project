const orderRouter = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyAccessToken } = require('../middlewares/veryfyToken');

orderRouter.get('/', orderController.getAll);
orderRouter.post('/', verifyAccessToken, orderController.createOrder);
orderRouter.get('/cart', verifyAccessToken, orderController.getCart);
orderRouter.post('/cart', verifyAccessToken, orderController.addToCart);
orderRouter.post('/checkout', verifyAccessToken, orderController.checkout);
orderRouter.delete('/clearcart', verifyAccessToken, orderController.clearCart);
orderRouter.get('/user/:id', verifyAccessToken, orderController.getUserOrdersController);
orderRouter.put('/comment/:id', verifyAccessToken, orderController.updateComment);
orderRouter.get('/:id', verifyAccessToken, orderController.getByIdorder);
orderRouter.put('/:id', verifyAccessToken, orderController.updateStatus);
orderRouter.delete('/:id', verifyAccessToken, orderController.delete);
// ==================================================================

orderRouter.delete('/cart/:id', verifyAccessToken, orderController.removeFromCart);

module.exports = orderRouter;

