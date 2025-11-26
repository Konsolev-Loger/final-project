const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const { verifyRefreshToken } = require('../middlewares/veryfyToken');

userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login);
userRouter.get('/logout', userController.logout);
userRouter.get('/refreshTokens', verifyRefreshToken, userController.refreshTokens); // ТУТ РЕФРЕШТОКЕН ----



module.exports = userRouter;

