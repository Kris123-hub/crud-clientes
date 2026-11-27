# Clientes CRUD

Proyecto CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de clientes,
desarrollado como práctica de Git y Git Flow.

## Stack

- **Backend:** PHP 8.2 (API REST en JSON)
- **Base de datos:** MySQL 8
- **Frontend:** HTML5, CSS y JavaScript vanilla
- **Entorno:** Docker Compose (PHP + MySQL)

## Cómo ejecutar

Requisitos: Docker y Docker Compose.

```bash
docker compose up --build
```

- Aplicación: http://localhost:8080/public/index.html
- API: http://localhost:8080/api/clientes.php
- MySQL: localhost:3306 (usuario `crud_user`, contraseña `crud_pass`, BD `crud_clientes`)

La base de datos se crea sola en el primer arranque (tabla `clientes` y datos
de ejemplo desde `api/db/schema.sql`).

## Estructura

```
├── docker-compose.yml     # Servicios: MySQL + PHP/Apache
├── Dockerfile             # Imagen de la aplicación
├── api/
│   ├── config.php         # Conexión PDO + helpers
│   ├── clientes.php       # API REST (GET, POST, PUT, DELETE)
│   └── db/schema.sql      # Tabla clientes + datos de ejemplo
└── public/
    ├── index.html         # Interfaz del CRUD
    ├── app.js             # Lógica del frontend (fetch)
    └── style.css          # Estilos
```

## Endpoint

| Método | URL | Descripción |
| ------ | --- | ----------- |
| GET | /api/clientes.php | Lista todos los clientes |
| GET | /api/clientes.php?id=N | Obtiene un cliente por id |
| POST | /api/clientes.php | Crea un cliente |
| PUT | /api/clientes.php?id=N | Actualiza un cliente |
| DELETE | /api/clientes.php?id=N | Elimina un cliente |

### Validación

`POST` y `PUT` validan los datos antes de escribirlos:

- `nombre` (obligatorio, máx. 100 caracteres) y `email` (obligatorio, formato válido, máx. 150 caracteres).
- `telefono` (opcional, máx. 20 caracteres) y `ciudad` (opcional, máx. 100 caracteres).

Un payload inválido devuelve `422` con un objeto `error` que contiene un mensaje por cada campo inválido, y la interfaz los muestra bajo cada campo.

## Git Flow

Este repositorio se maneja con Git Flow:

- `main`: código estable y liberado.
- `qa`: rama de pruebas/calidad antes de llegar a `main`.
- `dev`: integración de las ramas de trabajo.
- `feature/*`: nuevas funcionalidades (se integran a `dev`, luego `qa`, luego `main`).
- `hotfix/*`: correcciones urgentes sobre `main`.
