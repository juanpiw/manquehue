-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS landing_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE landing_db;

-- Create table for landing requests
CREATE TABLE IF NOT EXISTS landing_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) DEFAULT 'general',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('nuevo', 'contactado', 'procesando', 'completado') DEFAULT 'nuevo',
    notas TEXT,
    INDEX idx_correo (correo),
    INDEX idx_fecha (fecha_creacion),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional)
INSERT INTO landing_requests (nombre, correo, tipo, notas) VALUES
('Juan Pérez', 'juan@ejemplo.com', 'landing_request', 'Cliente interesado en landing interactiva'),
('María González', 'maria@ejemplo.com', 'general', 'Consulta general sobre servicios');

-- Create table for survey feedback
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    page VARCHAR(100) DEFAULT 'video_scroll_demo',
    lang VARCHAR(10) DEFAULT 'es',
    attractiveness TINYINT,
    sections JSON,
    contact ENUM('yes','no') DEFAULT 'no',
    name VARCHAR(255),
    email VARCHAR(255),
    comments TEXT,
    ip VARCHAR(45),
    user_agent VARCHAR(512),
    INDEX idx_feedback_created (created_at),
    INDEX idx_feedback_email (email),
    INDEX idx_feedback_page (page)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create a dedicated user for the application
-- CREATE USER IF NOT EXISTS 'landing_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT SELECT, INSERT, UPDATE ON landing_db.* TO 'landing_user'@'localhost';
-- FLUSH PRIVILEGES;
