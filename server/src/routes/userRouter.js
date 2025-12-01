const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const { verifyRefreshToken } = require('../middlewares/veryfyToken');

userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login);
userRouter.get('/logout', userController.logout);
userRouter.get('/refreshTokens', verifyRefreshToken, userController.refreshTokens); // ТУТ РЕФРЕШТОКЕН ----
userRouter.put('/profile/:id', userController.updateProfile);

module.exports = userRouter;

// {
//   "name": "Иван Иванов",
//   "email": "ivan@example.com",
//   "password": "SermerLORD@@10",
//   "phone": "+79991234567",
//   "is_admin": false
// }

// eyJ1c2VyIjp7ImlkIjozLCJuYW1lIjoi0JjQstCw0L0g0JjQstCw0L3QvtCyIiwiZW1haWwiOiJpdmFuQGV4YW1wbGUuY29tIiwicGhvbmUiOiIrNzk5OTEyMzQ1NjciLCJ1cGRhdGVkQXQiOiIyMDI1LTExLTI3VDA2OjQxOjI0LjI3NloiLCJjcmVhdGVkQXQiOiIyMDI1LTExLTI3VDA2OjQxOjI0LjI3NloiLCJpc19hZG1pbiI6bnVsbH0sImlhdCI6MTc2NDIyNTY4NCwiZXhwIjoxNzY0MjMwNjg0fQ
