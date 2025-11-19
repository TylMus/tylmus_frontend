FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Убедитесь что сборка работает
RUN npm run build

# Проверьте что файлы создались
RUN ls -la dist/

FROM nginx:alpine

# Копируем собранные файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Простой nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Проверяем структуру файлов
RUN ls -la /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]