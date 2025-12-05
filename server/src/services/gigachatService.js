process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

let accessToken = null;

async function getToken() {
  try {
    const response = await axios.post(
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
      `scope=${process.env.GIGACHAT_SCOPE}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          RqUID: crypto.randomUUID(),
          Authorization: `Basic ${Buffer.from(
            `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`,
          ).toString('base64')}`,
        },
      },
    );

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Ошибка получения токена:', error.response?.data || error.message);
    throw new Error('Token error', { cause: error });
  }
}

async function sendToGigaChat(userMessage) {
  try {
    if (!accessToken) {
      await getToken();
    }

    const response = await axios.post(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      {
        model: 'GigaChat',
        messages: [
          {
            role: 'system',
            content: `
Ты AI-ассистент сайта "Трендовые отделочные решения".
Ты эксперт по:
- отделочным материалам
- современному интерьеру
- стилям: лофт, минимализм, неоклассика, эко, хай-тек
- подбору полов, стен, потолков, плитки, краски

Твоя задача — помогать пользователю выбирать лучшие материалы.
Отвечай как профессиональный дизайнер, очень кратко и по делу.
Если пользователь не знает что выбрать — предлагай 2-3 варианта.
            `,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Ошибка GigaChat:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      accessToken = null;
      return sendToGigaChat(userMessage);
    }

    throw new Error('GigaChat error', { cause: error });
  }
}

module.exports = { sendToGigaChat };
