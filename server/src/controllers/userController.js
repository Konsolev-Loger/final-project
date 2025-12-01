const { User } = require('../../db/models');
const UserService = require('../services/userService');
const bcrypt = require('bcrypt');
const cookieConfig = require('../configs/coockieConfig');
const generateToken = require('../utils/generateToken');
const formatResponse = require('../utils/formatResponse');

class UserController {
  // валидация регистрации
  static async registration(req, res) {
    const { name, email, password, phone } = req.body;
    const { isValid, err } = await User.validateSignUpData({
      name,
      email,
      password,
    });
    if (!isValid)
      return res.status(400).json(formatResponse(400, 'Ошибка валидации', null, err));
    const emailLowerCase = email.toLowerCase();
    // регистрация
    try {
      const userFound = await UserService.getUserByEmail(emailLowerCase);
      if (userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с таким адресом электронной почты уже зарегистрирован',
              null,
              'Пользователь с таким адресом электронной почты уже зарегистрирован',
            ),
          );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserService.createUser({
        name,
        email: emailLowerCase,
        password: hashedPassword,
        phone,
        // is_admin: false,
      });
      if (!newUser) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Ошибка при создании пользователя',
              null,
              'Ошибка при создании пользователя',
            ),
          );
      }
      delete newUser.password;
      const { accessToken, refreshToken } = generateToken(newUser);
      return res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(
            201,
            'Пользователь зарегистрирован',
            { user: newUser, accessToken },
            null,
          ),
        ); // тут возможно нужно переделать
    } catch (error) {
      console.log('===registration===', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // ==================================================================================
  // eslint-disable-next-line consistent-return
  static async login(req, res) {
    const { email, password } = req.body;
    const { isValid, error } = await User.validateSignInData({ email, password });
    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Ошибка валидации', null, error));
    }
    const emailLowerCase = email.toLowerCase();
    try {
      const userFound = await UserService.getUserByEmail(emailLowerCase);
      if (!userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с таким email не найден',
              null,
              'Пользователь не найден',
            ),
          );
      }
      const isValidPassword = await bcrypt.compare(password, userFound.password);
      if (!isValidPassword) {
        return res
          .status(400)
          .json(formatResponse(400, 'Неверный пароль', null, 'Неверный пароль'));
      }
      const { accessToken, refreshToken } = generateToken(userFound);
      return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(200, 'Успешный вход', { user: userFound, accessToken }, null),
        );
    } catch (err) {
      console.log('===UserController.login====', err);
    }
  }
  // ==================================================================================

  static async logout(req, res) {
    try {
      res
        .status(200)
        .clearCookie('refreshToken')
        .json({ message: 'Пользователь успешно вышел из системы' });
    } catch (error) {
      console.log('====UserController.logout====', error);
      res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  // ==================================================================================
  static async getUserById(req, res) {
    const { id } = req.params;
    console.log('+++++++++++++++++++++', req.params);

    try {
      const user = await UserService.getUserById(id);
      if (!user) {
        return res
          .status(404)
          .json(
            formatResponse(404, 'Пользователь не найден', null, 'Пользователь не найден'),
          );
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log('=======UserController.getUserById=========', error);
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }
  // ==================================================================================

  // static async refreshTokens(req, res) {
  //   try {
  //     const { user } = res.locals;
  //     const { accessToken, refreshToken } = generateToken({ user });
  //     res
  //       .status(200)
  //       .cookie('refreshToken', refreshToken, cookieConfig.refresh)
  //       .json(formatResponse(200, 'Токены обновлены', { accessToken, user }, null));
  //   } catch ({ message }) {
  //     console.error('Ошибка контроллера рефрештокена', message);
  //     res.status(500).json(formatResponse(500, 'Ошибка сервера', null, message));
  //   }
  // }

  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;

      // Загружаем полные данные из БД
      const fullUser = await User.findByPk(user.id);

      if (!fullUser) {
        return res
          .status(404)
          .json(
            formatResponse(404, 'Пользователь не найден', null, 'Пользователь не найден'),
          );
      }
      const userWithoutPassword = fullUser.toJSON();
      delete userWithoutPassword.password;
      const { accessToken, refreshToken } = generateToken(userWithoutPassword);

      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(
          formatResponse(
            200,
            'Токены обновлены',
            {
              accessToken,
              user: userWithoutPassword,
            },
            null,
          ),
        );
    } catch ({ message }) {
      console.error('Ошибка контроллера рефрештокена', message);
      res.status(500).json(formatResponse(500, 'Ошибка сервера', null, message));
    }
  }

  // ==================================================================================
  static async updateProfile(req, res) {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    try {
      const user = await UserService.getUserById(id);
      if (!user) {
        return res
          .status(404)
          .json(
            formatResponse(404, 'Пользователь не найден', null, 'Пользователь не найден'),
          );
      }

      const oldEmail = user.email;
      const updatedUser = await UserService.updateUser(id, {
        name,
        email,
        phone,
      });

      const userWithoutPassword = { ...updatedUser.toJSON() };
      delete userWithoutPassword.password;
      let accessToken;
      if (oldEmail !== email) {
        const tokens = generateToken(userWithoutPassword);
        accessToken = tokens.accessToken;

        res.cookie('refreshToken', tokens.refreshToken, cookieConfig.refresh);
      }

      return res.status(200).json(
        formatResponse(
          200,
          'Профиль обновлен',
          {
            user: userWithoutPassword,
            accessToken: accessToken || undefined,
          },
          null,
        ),
      );
    } catch (error) {
      console.log('===updateProfile===', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка обновления профиля', null, error.message));
    }
  }
}

module.exports = UserController;
