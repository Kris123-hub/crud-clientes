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
│   └── db/schema.sql      # Tabla clientes + datos de ejemplo
└── public/                # Frontend (se añade en una funcionalidad siguiente)
```

## Git Flow

Este repositorio se maneja con Git Flow:

- `main`: código estable y liberado.
- `qa`: rama de pruebas/calidad antes de llegar a `main`.
- `dev`: integración de las ramas de trabajo.
- `feature/*`: nuevas funcionalidades (se integran a `dev`, luego `qa`, luego `main`).
- `hotfix/*`: correcciones urgentes sobre `main`.
