
FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod


# Stage 2
FROM nginx:1.17.1-alpine
COPY --from=build app/dist/colegio/browser /usr/share/nginx/html
COPY --from=build app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]