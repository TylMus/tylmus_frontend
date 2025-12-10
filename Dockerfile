FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

RUN ls -la dist/

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

RUN ls -la /usr/share/nginx/html/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"] 