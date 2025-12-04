const express = require('express');
require('dotenv').config();
const serverConfig = require('./configs/serverConfig');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const roomRouter = require('./routes/roomRouter');
const categoryRouter = require('./routes/categoryRouter');
const materialRouter = require('./routes/materialRouter');
const adminRouter = require('./routes/adminRouter');
const emailVerificationRoutes = require('./routes/emailVerificationRoutes');
const aiRouter = require('./routes/aiRouter');

const app = express();
app.use(express.json());
serverConfig(app);

app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/category', categoryRouter);
app.use('/api/material', materialRouter);
app.use('/admin', adminRouter);
app.use('/api/ai', aiRouter);

require('./services/telegramBot');
app.use('/api/email-verification', emailVerificationRoutes);
// =======================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server has started on port, ${PORT}`);
});

module.exports = app;
