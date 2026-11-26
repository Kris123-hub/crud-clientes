-- Schema for the Customers CRUD (Git Flow practice project)

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20) DEFAULT NULL,
    ciudad VARCHAR(100) DEFAULT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clientes_nombre (nombre),
    INDEX idx_clientes_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial sample data
INSERT INTO clientes (nombre, email, telefono, ciudad) VALUES
    ('Ana Torres', 'ana.torres@example.com', '3115550101', 'Lima'),
    ('Carlos Ruiz', 'carlos.ruiz@example.com', '3205550102', 'Arequipa'),
    ('María Fernández', 'maria.fernandez@example.com', '3335550103', 'Cusco');
