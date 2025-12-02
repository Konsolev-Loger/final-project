const express = require('express');
const router = express.Router();
const telegramBot = require('../services/telegramBot');

router.get('/check-link/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const isLinked = telegramBot.isUserLinked(parseInt(userId));
    const userLink = telegramBot.getUserLink(parseInt(userId));

    res.json({
      success: true,
      isLinked,
      userLink: isLinked
        ? {
            username: userLink.username,
            firstName: userLink.firstName,
            linkedAt: userLink.linkedAt,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/link-status/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userLink = telegramBot.getUserLink(userId);

    let chatLink = null;
    if (userLink) {
      chatLink = telegramBot.getChatLink(userLink.chatId);
    }
    res.json({
      success: true,
      userLink,
      chatLink,
      message: userLink ? 'Пользователь привязан' : 'Пользователь не привязан',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/send-code', async (req, res) => {
  try {
    const { userId, newEmail } = req.body;

    console.log('Запрос на отправку кода:', { userId, newEmail });

    if (!userId || !newEmail) {
      return res.status(400).json({
        success: false,
        error: 'Необходимы userId и newEmail',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный формат email',
      });
    }

    const result = await telegramBot.sendCodeToLinkedUser(parseInt(userId), newEmail);

    res.json({
      success: true,
      message: 'Код отправлен в Telegram',
    });
  } catch (error) {
    console.error('Ошибка в send-code:', error.message);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { code } = req.body;

    console.log('Проверка кода:', code);

    if (!code || code.length !== 6 || isNaN(code)) {
      return res.status(400).json({
        success: false,
        error: 'Код должен быть 6 цифр',
      });
    }

    const result = telegramBot.verifyCode(code);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      userId: result.userId,
      email: result.email,
    });
  } catch (error) {
    console.error('Ошибка в verify-code:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера',
    });
  }
});

router.delete('/unlink/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    console.log('🔗 Запрос на отмену привязки:', userId);
    if (!telegramBot.userLinks || typeof telegramBot.userLinks !== 'object') {
      console.error('telegramBot.userLinks не инициализирован');
      return res.status(500).json({
        success: false,
        error: 'Сервис Telegram не инициализирован',
      });
    }

    console.log('Все привязки:', Array.from(telegramBot.userLinks.entries()));

    const wasLinked = telegramBot.userLinks.delete(userId);

    if (wasLinked) {
      console.log(`Привязка пользователя ${userId} отменена`);
      res.json({
        success: true,
        message: 'Привязка Telegram отменена',
      });
    } else {
      console.log(`Пользователь ${userId} не был привязан`);
      res.status(404).json({
        success: false,
        error: 'Привязка не найдена',
      });
    }
  } catch (error) {
    console.error('Ошибка в unlink:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера',
    });
  }
});
module.exports = router;
