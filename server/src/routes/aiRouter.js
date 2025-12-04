const { Router } = require('express');
const { sendToGigaChat } = require('../services/gigachatService');

const router = Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const answer = await sendToGigaChat(message);

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI error' });
  }
});

module.exports = router;
