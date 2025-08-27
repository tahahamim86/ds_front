FROM node:18-alpine as frontend-build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --configuration=production

# Then use a lightweight webserver like nginx to serve dist folder
FROM nginx:alpine

COPY --from=frontend-build /app/dist/your-angular-project /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
