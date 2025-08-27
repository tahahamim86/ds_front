# === FRONTEND BUILD STAGE ===
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy package.json and lock files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all Angular code
COPY . .

# Build Angular app
RUN npm run build --configuration=production


# === BACKEND BUILD STAGE ===
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /home/app

COPY pom.xml .
COPY src ./src

# Build Spring Boot app
RUN mvn clean package -DskipTests


# === FINAL STAGE (SERVE WITH NGINX + JAR) ===
FROM eclipse-temurin:17-jre AS final
WORKDIR /usr/local/lib

# Copy backend JAR
COPY --from=backend-build /home/app/target/*.jar app.jar

# Copy Angular dist to Nginx for serving static files
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=frontend-build /app/dist/doctorsina ./
