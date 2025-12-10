FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

RUN ls -la dist/

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    ln -sf /dev/stdout /var/log/nginx/app_access.log && \
    ln -sf /dev/stdout /var/log/nginx/static_access.log
RUN ls -la /usr/share/nginx/html/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"] 

