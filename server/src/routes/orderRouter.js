const orderRouter = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyAccessToken } = require('../middlewares/veryfyToken');

orderRouter.get('/', orderController.getAll);
orderRouter.post('/', verifyAccessToken, orderController.createOrder);
orderRouter.get('/user/:id', verifyAccessToken, orderController.getUserOrdersController);
orderRouter.put('/comment/:id', verifyAccessToken, orderController.updateComment);
orderRouter.get('/:id', verifyAccessToken, orderController.getById);
orderRouter.put('/:id', verifyAccessToken, orderController.updateStatus);
orderRouter.delete('/:id', verifyAccessToken, orderController.delete);
// ==================================================================
orderRouter.get('/cart', verifyAccessToken, orderController.getCart);
orderRouter.post('/cart', verifyAccessToken, orderController.addToCart);
orderRouter.delete('/cart/:id', verifyAccessToken, orderController.removeFromCart);
orderRouter.delete('/clearcart', verifyAccessToken, orderController.clearCart);
orderRouter.post('/checkout', verifyAccessToken, orderController.checkout);

module.exports = orderRouter;

// {
//   "user_id": 1,
//   "total_price": 2999.99,
//   "comment": "Доставить до 18:00",
//   "status": true
// }

// {
//   "comment": "Доставить до 18:00",
//   "total_price": 2999,
//   "items": [

//     {
//       "material_id": 7,
//       "quantity": 1,
//       "custom_room_id": null
//     }
//   ],
//   "castomRooms": [
//     {
//       "name": "Спальня",
//       "length": 4.5,
//       "width": 3.8
//     }
//   ]
// }
// =================================при создании заказа такое выдает==============================================
// {
//   "statusCode": 201,
//   "message": "Заказ создан",
//   "data": {
//     "id": 29,
//     "user_id": 6,
//     "total_price": "2999",
//     "comment": "Доставить",
//     "status": false,
//     "createdAt": "2025-11-27T08:32:14.914Z",
//     "updatedAt": "2025-11-27T08:32:14.914Z",
//     "items": [
//       {
//         "id": 35,
//         "order_id": 29,
//         "material_id": 7,
//         "room_id": null,
//         "castom_room_id": null,
//         "quantity": 1,
//         "price_at": 0,
//         "createdAt": "2025-11-27T08:32:14.950Z",
//         "updatedAt": "2025-11-27T08:32:14.950Z",
//         "material": {
//           "id": 7,
//           "category_id": 1,
//           "name": "Ригельный кирпич Роттердам 709",
//           "title": "Ригельный кирпич «Роттердам 709» добавит характер и стиль вашему интерьеру.",
//           "price": "1600 руб./м2",
//           "is_popular": false,
//           "img": "Ригельный кирпич Роттердам 709.jpg",
//           "createdAt": "2025-11-27T06:38:00.674Z",
//           "updatedAt": "2025-11-27T06:38:00.674Z"
//         },
//         "room": null,
//         "castomRooms": null
//       }
//     ],
//     "castomRooms": [
//       {
//         "id": 24,
//         "order_id": 29,
//         "name": "Спальня",
//         "length": "4.5",
//         "width": "3.8",
//         "height": null,
//         "area": "17.1",
//         "createdAt": "2025-11-27T08:32:14.948Z",
//         "updatedAt": "2025-11-27T08:32:14.948Z"
//       }
//     ]
//   },
//   "error": null
// }
