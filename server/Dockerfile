FROM node:22.0.0-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Открываем порты для API и WebSocket
EXPOSE 3000 3001

# Запускаем приложение
CMD ["npm", "start"]