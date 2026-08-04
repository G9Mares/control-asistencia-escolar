# Compilación reproducible de Angular.
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Servidor web mínimo para los archivos estáticos resultantes.
FROM nginx:1.28-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/control-asistencia-escolar/browser /usr/share/nginx/html

EXPOSE 80
