# === FRONTEND BUILD STAGE ===
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# === PRODUCTION STAGE ===
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# ✅ Replace with the actual dist folder name
COPY --from=build /app/dist/DoctorSinaWeb ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
