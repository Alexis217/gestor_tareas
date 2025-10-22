# --- 1. ETAPA DE "BUILD" ---
# Usamos una imagen de Node (alpine es una versión ligera)
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de manifiesto del proyecto
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies como TypeScript)
RUN npm install

# Copiamos el resto del código fuente (src, tsconfig.json, etc.)
COPY . .

# Ejecutamos el script de "build" (definido en package.json)
# Esto crea la carpeta /dist
RUN npm run build

# --- 2. ETAPA DE "PRODUCCIÓN" ---
# Empezamos desde una imagen limpia de Node (mantenemos la misma versión)
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos los package.json de nuevo
COPY package*.json ./

# Instalamos SÓLO las dependencias de producción
# --omit=dev es el comando moderno (reemplaza a --production)
RUN npm install --omit=dev

# Copiamos la carpeta 'dist' (el JS compilado) desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Exponemos el puerto 3000 (el que usa nuestro server)
EXPOSE 3000

# El comando final para correr la aplicación
# Esto ejecuta: "node dist/server.js"
CMD [ "npm", "start" ]