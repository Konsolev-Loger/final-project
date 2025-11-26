require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const coockeParser = require('cookie-parser');
const path = require('path');

const cors = require('cors'); // после подключения корса
const corsConfig = require('./corsConfig');

const serverConfig = (app) => {
  app.use(morgan('dev')); // для логирования HTTP-запросов. Отладка маниторинга.
  app.use(express.urlencoded({ extended: true })); // понимает данные из HTML-форм.
  app.use(express.json()); // обробатывает данные пришедшие в формате JSON и делает доступным в req.body.
  app.use(express.static(path.join(__dirname, '../public'))); // статическая раздача файлов 'шрифты, картинки, стили'.
  app.use(coockeParser()); // НЕ ЗАБЫАТЬ УСТАНОВИТЬ!
  app.use(cors(corsConfig)); // подлкючаем корс как мидлвару
};

module.exports = serverConfig;
