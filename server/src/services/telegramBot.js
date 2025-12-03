const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

class TelegramBotService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.emailCodes = new Map();
    this.userLinks = new Map();
    this.setupHandlers();

    console.log('Telegram Bot запущен');
  }

  setupHandlers() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      // eslint-disable-next-line no-unused-vars
      const { username } = msg.from;
      const firstName = msg.from.first_name;

      this.bot.sendMessage(
        chatId,
        `👋 Привет, ${firstName || 'друг'}!\n\n` +
          'Я бот для подтверждения email на сайте.\n\n' +
          '📌 Чтобы привязать аккаунт:\n' +
          '1. Зайдите в личный кабинет на сайте\n' +
          '2. Нажмите "Сменить email"\n' +
          '3. Скопируйте ваш ID пользователя\n' +
          '4. Отправьте мне команду:\n' +
          `<code>/link [ваш ID]</code>\n\n` +
          'После привязки коды подтверждения будут приходить сюда автоматически!',
        { parse_mode: 'HTML' },
      );
    });

    // eslint-disable-next-line consistent-return
    this.bot.onText(/\/link (\d+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const userId = parseInt(match[1], 10);
      const { username } = msg.from;
      const firstName = msg.from.first_name;

      // eslint-disable-next-line no-restricted-globals
      if (isNaN(userId) || userId <= 0) {
        return this.bot.sendMessage(
          chatId,
          'Неверный ID. ID должен быть положительным числом.',
          { parse_mode: 'HTML' },
        );
      }

      let existingUserId = null;
      for (const [uid, info] of this.userLinks.entries()) {
        if (info.chatId === chatId) {
          existingUserId = uid;
          break;
        }
      }

      if (existingUserId) {
        return this.bot.sendMessage(
          chatId,
          `⚠️ Внимание!\n\n` +
            `Этот Telegram аккаунт уже привязан к ID: <code>${existingUserId}</code>\n\n` +
            `Если вы хотите привязать к новому ID (${userId}):\n` +
            `1. Сначала отвяжите старый аккаунт командой:\n` +
            `<code>/unlink</code>\n\n` +
            `2. Затем привяжите заново:\n` +
            `<code>/link ${userId}</code>\n\n` +
            `📌 Один Telegram можно привязать только к одному аккаунту!`,
          { parse_mode: 'HTML' },
        );
      }

      const existingLink = this.userLinks.get(userId);
      if (existingLink) {
        return this.bot.sendMessage(
          chatId,
          `⚠️ Внимание!\n\n` +
            `ID <code>${userId}</code> уже привязан к Telegram аккаунту:\n` +
            `• @${existingLink.username || 'неизвестно'}\n` +
            `• Chat ID: <code>${existingLink.chatId}</code>\n\n` +
            `Один ID пользователя можно привязать только к одному Telegram.\n\n` +
            `Если это ваш аккаунт и вы хотите сменить Telegram:\n` +
            `1. Попросите администратора отвязать старый аккаунт\n` +
            `2. Или используйте команду /unlink в старом Telegram`,
          { parse_mode: 'HTML' },
        );
      }

      this.userLinks.set(userId, {
        chatId,
        username: username || null,
        firstName: firstName || 'Пользователь',
        linkedAt: new Date().toISOString(),
      });

      console.log(`🔗 Пользователь ${userId} привязан к chatId ${chatId}`);

      await this.bot.sendMessage(
        chatId,
        `Отлично, ${firstName || 'друг'}!\n\n` +
          `Аккаунт успешно привязан!\n\n` +
          `📋 Информация:\n` +
          `• Ваш ID: <code>${userId}</code>\n` +
          `• Telegram: @${username || 'не указан'}\n` +
          `• Chat ID: <code>${chatId}</code>\n\n` +
          `Теперь при смене email на сайте я буду отправлять коды подтверждения сюда.\n\n` +
          `🎉 Можно возвращаться на сайт!`,
        { parse_mode: 'HTML' },
      );
    });

    this.bot.onText(/\/myid/, (msg) => {
      const chatId = msg.chat.id;

      let userInfo = null;
      for (const [userId, info] of this.userLinks.entries()) {
        if (info.chatId === chatId) {
          userInfo = { userId, ...info };
          break;
        }
      }

      if (userInfo) {
        this.bot.sendMessage(
          chatId,
          `👤 Ваша привязка:\n\n` +
            `• ID пользователя: <code>${userInfo.userId}</code>\n` +
            `• Chat ID: <code>${chatId}</code>\n` +
            `• Привязан: ${new Date(userInfo.linkedAt).toLocaleString('ru-RU')}\n\n` +
            `Используйте этот ID на сайте.`,
          { parse_mode: 'HTML' },
        );
      } else {
        this.bot.sendMessage(
          chatId,
          'Ваш аккаунт не привязан.\n\n' +
            'Для привязки:\n' +
            '1. Узнайте свой ID в личном кабинете на сайте\n' +
            '2. Отправьте мне команду:\n' +
            `<code>/link [ваш ID]</code>`,
          { parse_mode: 'HTML' },
        );
      }
    });

    // Обработчик /unlink должен быть ВНЕ обработчика /myid!
    this.bot.onText(/\/unlink/, async (msg) => {
      const chatId = msg.chat.id;
      // eslint-disable-next-line no-unused-vars
      const { username } = msg.from;

      let foundUserId = null;
      for (const [userId, info] of this.userLinks.entries()) {
        if (info.chatId === chatId) {
          foundUserId = userId;
          break;
        }
      }

      if (foundUserId) {
        this.userLinks.delete(foundUserId);

        await this.bot.sendMessage(
          chatId,
          `🔗 Привязка отменена!\n\n` +
            `Ваш аккаунт отвязан от ID: ${foundUserId}\n\n` +
            `Чтобы привязать аккаунт заново:\n` +
            `1. На сайте нажмите "Сменить email"\n` +
            `2. Скопируйте новый ID\n` +
            `3. Отправьте мне команду:\n` +
            `<code>/link [ваш ID]</code>`,
          { parse_mode: 'HTML' },
        );

        console.log(`🔗 Пользователь ${foundUserId} отвязан`);
      } else {
        await this.bot.sendMessage(
          chatId,
          `Ваш аккаунт не привязан.\n\n` +
            `Сначала привяжите аккаунт командой:\n` +
            `<code>/link [ваш ID]</code>`,
          { parse_mode: 'HTML' },
        );
      }
    });

    // Обработчик /check тоже должен быть отдельно
    // eslint-disable-next-line consistent-return
    this.bot.onText(/\/check/, (msg) => {
      const chatId = msg.chat.id;
      const allLinks = Array.from(this.userLinks.entries());

      if (allLinks.length === 0) {
        return this.bot.sendMessage(chatId, 'Нет привязанных аккаунтов');
      }

      let message = `📊 Все привязки (${allLinks.length}):\n\n`;

      allLinks.forEach(([userId, info], index) => {
        message += `${index + 1}. ID: <code>${userId}</code>\n`;
        message += `   Telegram: @${info.username || 'нет'}\n`;
        message += `   Chat ID: <code>${info.chatId}</code>\n`;
        message += `   Привязан: ${new Date(info.linkedAt).toLocaleString('ru-RU')}\n\n`;
      });

      this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    });
  }

  isChatIdLinked(chatId) {
    for (const [userId, info] of this.userLinks.entries()) {
      if (info.chatId === chatId) {
        return { isLinked: true, userId, info };
      }
    }
    return { isLinked: false };
  }

  isUserIdLinked(userId) {
    const info = this.userLinks.get(userId);
    return { isLinked: !!info, info };
  }

  isUserLinked(userId) {
    return this.userLinks.has(userId);
  }

  getUserLink(userId) {
    const link = this.userLinks.get(userId);
    if (!link) return null;

    return {
      userId,
      ...link,
      linkedAtFormatted: new Date(link.linkedAt).toLocaleString('ru-RU'),
    };
  }

  getChatLink(chatId) {
    for (const [userId, info] of this.userLinks.entries()) {
      if (info.chatId === chatId) {
        return {
          userId,
          ...info,
          linkedAtFormatted: new Date(info.linkedAt).toLocaleString('ru-RU'),
        };
      }
    }
    return null;
  }

  async sendCodeToLinkedUser(userId, email) {
    const userLink = this.userLinks.get(userId);

    if (!userLink) {
      throw new Error(
        `Аккаунт не привязан к Telegram.\n\n` +
          `Сначала привяжите аккаунт:\n` +
          `1. Напишите боту @code_super_bot\n` +
          `2. Отправьте команду: /link [ваш ID]\n` +
          `3. Ваш ID: ${userId}`,
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = Date.now() + 1 * 60 * 1000;

    this.emailCodes.set(code, { userId, email, expires });

    try {
      await this.bot.sendMessage(
        userLink.chatId,
        `📧 Подтверждение смены email\n\n` +
          `Привет, ${userLink.firstName}!\n\n` +
          `Вы запросили смену email на сайте.\n\n` +
          `📋 Данные:\n` +
          `• Ваш ID: <code>${userId}</code>\n` +
          `• Новый email: ${email}\n\n` +
          `🔐 Код подтверждения:\n` +
          `<code>${code}</code>\n\n` +
          `⏳ Код действителен 1 минуту.\n` +
          `Введите этот код на сайте для подтверждения.`,
        { parse_mode: 'HTML' },
      );

      console.log(
        `Код ${code} отправлен пользователю ${userId} (chat: ${userLink.chatId})`,
      );
      return { success: true, code };
    } catch (error) {
      console.error(`Ошибка отправки пользователю ${userId}:`, error.message);

      if (error.response?.body?.error_code === 403) {
        this.userLinks.delete(userId);
        throw new Error(
          'Вы заблокировали бота. Разблокируйте @code_super_bot в Telegram и привяжите аккаунт заново.', { cause: error },
        );
      }

      throw new Error('Ошибка отправки сообщения в Telegram', { cause: error });
    }
  }

  verifyCode(code) {
    const numericCode = parseInt(code, 10);
    const data = this.emailCodes.get(numericCode);

    if (!data) {
      return { success: false, error: 'Код не найден' };
    }

    if (data.expires < Date.now()) {
      this.emailCodes.delete(numericCode);
      return { success: false, error: 'Код просрочен' };
    }

    const { userId, email } = data;
    this.emailCodes.delete(numericCode);

    return { success: true, userId, email };
  }
}

module.exports = new TelegramBotService();
