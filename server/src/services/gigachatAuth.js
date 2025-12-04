const axios = require('axios');
const qs = require('qs');

let accessToken = null;
let tokenExpiresAt = 0;

async function getGigaChatToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  try {
    const auth = Buffer.from(
      `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await axios.post(
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
      qs.stringify({
        scope: process.env.GIGACHAT_SCOPE,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
          RqUID: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    );

    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

    return accessToken;
  } catch (error) {
    console.error('GigaChat auth error:', error.response?.data || error.message);
    throw new Error('Не удалось получить токен GigaChat', { cause: error });
  }
}

module.exports = { getGigaChatToken };
