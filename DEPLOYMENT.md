# Despliegue con Docker en EC2

Este frontend no necesita variables de entorno, base de datos ni servicios adicionales.

## Prueba local

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Abre `http://localhost`. Para detenerlo:

```bash
docker compose down
```

## Despliegue en EC2

1. En el grupo de seguridad de la instancia, permite tráfico TCP de entrada al puerto `80` desde las direcciones que correspondan a tu caso de uso.
2. Instala Docker y el complemento Docker Compose en la instancia.
3. Copia o clona el proyecto en la instancia.
4. Desde la carpeta del proyecto, ejecuta:

   ```bash
   docker compose up -d --build
   ```

5. Consulta el estado y registros si son necesarios:

   ```bash
   docker compose ps
   docker compose logs -f
   ```

La aplicación quedará disponible en `http://IP_PUBLICA_DE_EC2` y conserva las rutas `/login`, `/asistencias` y `/dashboard` al recargar.

## Actualización

Después de subir cambios al servidor:

```bash
docker compose up -d --build
```
