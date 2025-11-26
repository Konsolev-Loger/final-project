const express = require('express');
require('dotenv').config();
const serverConfig = require('./configs/serverConfig');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const roomRouter = require('./routes/roomRouter');

const app = express();

serverConfig(app);

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/rooms', roomRouter);

// =======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server has started on port, ${PORT}`);
});

module.exports = app;
